import PendingRegistrations from "./PendingRegistrations";
import CreateTournament from "./CreateTournament.jsx";
import RegistrationsByStatus from "./RegistrationsByStatus.jsx";
import BroadcastEmail from "./BroadcastEmail.jsx";
import { Shield, Radio, Activity, PlusCircle, Mail, Users } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 py-12 md:px-12 lg:px-24">
        
        {/* HUD HEADER */}
        <header className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-purple-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Authorized Access Only
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic">
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
    <section className={`bg-slate-900/40 border border-slate-800 border-t-2 ${borderColor} rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:bg-slate-900/60 shadow-xl shadow-black/20`}>
      <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-4 ${accentColor} rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
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
    <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
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