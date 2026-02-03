import { useEffect, useState } from "react";
import api from "../../api/axios";
import PendingRegistrations from "./PendingRegistrations";
import CreateTournament from "./CreateTournament.jsx";
import RegistrationsByStatus from "./RegistrationsByStatus.jsx";
import BroadcastEmail from "./BroadcastEmail.jsx";
import { Shield, Radio, Activity, PlusCircle, Mail, Users, Trash2 } from "lucide-react";

export default function Admin() {
  const [activeTournaments, setActiveTournaments] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [activeError, setActiveError] = useState("");

  useEffect(() => {
    const loadActive = async () => {
      try {
        const res = await api.get("/tournaments/active");
        setActiveTournaments(res.data || []);
      } catch (err) {
        console.error("Failed to load active tournaments", err);
        setActiveError("Unable to load active tournaments.");
      } finally {
        setLoadingActive(false);
      }
    };
    loadActive();
  }, []);

  const handleDeleteTournament = async (id) => {
    const ok = window.confirm("Delete this tournament? This will remove all registrations and payments.");
    if (!ok) return;
    try {
      await api.delete(`/admin/tournament/${id}`);
      setActiveTournaments((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete tournament");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[20%] w-[35%] h-[35%] bg-fuchsia-900/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 px-6 py-10 md:px-12 lg:px-20">
        
        {/* HUD HEADER */}
        <header className="mb-10 md:mb-12 border-b border-slate-800/80 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-purple-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Authorized Access Only
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
              Command <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">Center</span>
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" /> System Administration & Tournament Control
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] font-bold uppercase text-slate-300 tracking-widest">System Live: v2.4.0</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: LIVE DATA FEED */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* PENDING SECTION */}
            <AdminSection 
              title="Pending Approvals" 
              accentColor="bg-purple-500" 
              borderColor="border-t-purple-500"
              icon={<Radio className="text-purple-500" size={20} />}
            >
              <PendingRegistrations />
            </AdminSection>

            {/* APPROVED SECTION */}
            <AdminSection 
              title="Approved Teams" 
              accentColor="bg-emerald-500" 
              borderColor="border-t-emerald-500"
              icon={<Activity className="text-emerald-500" size={20} />}
            >
              <RegistrationsByStatus status="APPROVED" title="Approved Teams" />
            </AdminSection>

            {/* REJECTED SECTION */}
            <AdminSection 
              title="Rejected Archive" 
              accentColor="bg-red-500" 
              borderColor="border-t-red-500"
              icon={<Shield className="text-red-500" size={20} />}
            >
              <RegistrationsByStatus status="REJECTED" title="Rejected Teams" />
            </AdminSection>
          </div>

          {/* RIGHT COLUMN: ACTIONS & DEPLOYMENT */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* QUICK STATS HUD */}
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="Total Players" value="1,284" icon={<Users size={16}/>} />
              <StatBox label="Active Events" value="12" icon={<Activity size={16}/>} color="text-purple-500" />
            </div>

            {/* ACTIVE TOURNAMENTS */}
            <AdminSection 
              title="Active Tournaments" 
              accentColor="bg-indigo-500" 
              borderColor="border-t-indigo-500"
              icon={<Activity className="text-indigo-500" size={20} />}
            >
              {loadingActive ? (
                <p className="text-slate-400">Loading active tournaments...</p>
              ) : activeError ? (
                <p className="text-red-400">{activeError}</p>
              ) : !activeTournaments.length ? (
                <p className="text-slate-400">No active tournaments found.</p>
              ) : (
                <div className="space-y-3">
                  {activeTournaments.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-100">{t.title}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">
                          {t.game} • {t.format}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTournament(t.id)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AdminSection>

            {/* BROADCAST SECTION */}
            <AdminSection 
              title="Broadcast Email" 
              accentColor="bg-cyan-500" 
              borderColor="border-t-cyan-500"
              icon={<Mail className="text-cyan-500" size={20} />}
            >
              <BroadcastEmail />
            </AdminSection>

            {/* DEPLOYMENT SECTION */}
            <AdminSection 
              title="Deploy Tournament" 
              accentColor="bg-fuchsia-500" 
              borderColor="border-t-fuchsia-500"
              icon={<PlusCircle className="text-fuchsia-500" size={20} />}
            >
              <CreateTournament />
            </AdminSection>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Section Container with HUD styling
 */
function AdminSection({ title, children, accentColor, borderColor, icon }) {
  return (
    <section className={`bg-slate-900/50 border border-slate-800/90 border-t-2 ${borderColor} rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:bg-slate-900/70 shadow-2xl shadow-black/30`}>
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-4 ${accentColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.25)]`} />
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-100">
            {title}
          </h2>
        </div>
        {icon}
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

/**
 * HUD Style Stat Box
 */
function StatBox({ label, value, icon, color = "text-white" }) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-500">{icon}</span>
        <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">{label}</p>
      </div>
      <p className={`text-3xl font-black italic tracking-tighter ${color}`}>
        {value}
      </p>
    </div>
  );
}
