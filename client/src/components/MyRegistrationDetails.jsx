import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Gamepad, 
  Users, 
  Calendar, 
  Trophy, 
  Shield, 
  ChevronLeft
} from "lucide-react";
import api from "../api/axios";

export default function MyRegistrationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/registrations/my/${id}`)
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 403)
          setError("Your registration is currently pending admin approval.");
        else
          setError("Unable to retrieve registration details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CenteredStatus text="Accessing Arena Records..." loading />;
  if (error) return <CenteredStatus text={error} error />;

  const { tournament, teamMembers, spotNumber, teamName } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Navigation & Header */}
        <header className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back to Tournaments
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  Confirmed Entry
                </span>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest flex items-center gap-1">
                  <Gamepad size={14} /> {tournament.game}
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent uppercase tracking-tighter italic">
                {tournament.title}
              </h1>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl text-center min-w-[140px] shadow-lg shadow-indigo-500/5">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-1">Your Slot</p>
              <p className="text-5xl font-black text-white leading-none">#{spotNumber}</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={<Users size={18}/>} label="Team Name" value={teamName} />
              <StatCard icon={<Trophy size={18}/>} label="Prize Pool" value={tournament.prizePool} />
              <StatCard icon={<Shield size={18}/>} label="Format" value={tournament.format} />
              <div className="col-span-2 md:col-span-3">
                <StatCard 
                  icon={<Calendar size={18}/>} 
                  label="Match Schedule" 
                  value={new Date(tournament.startDateTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })} 
                />
              </div>
            </div>

            {/* Rules Section */}
            {tournament.rules && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <Shield className="text-indigo-500" size={20} /> Tournament Rules
                </h2>
                <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  {tournament.rules}
                </div>
              </div>
            )}
          </div>

          {/* Roster Column */}
          <aside className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-2">
              <Users size={16} className="text-indigo-500" /> Active Roster
            </h2>
            <div className="space-y-3">
              {teamMembers.map((m, i) => (
                <div 
                  key={m.id} 
                  className="group bg-slate-900/60 border border-slate-800 p-4 rounded-2xl transition-all hover:border-indigo-500/50 hover:bg-slate-900"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-indigo-100">{m.name}</p>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">P{i+1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-indigo-400 font-mono uppercase tracking-tighter">IGN: {m.inGameName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{m.email}</p>
                    <p className="text-[10px] text-slate-500">{m.phone}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Box */}
            <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-2xl">
              <p className="text-xs text-indigo-300 leading-tight">
                <strong>Need help?</strong> If your roster details are incorrect, contact the tournament marshals immediately.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900/60 transition-colors">
      <div className="text-indigo-500 mb-2">{icon}</div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
      <p className="font-bold text-slate-100 truncate">{value}</p>
    </div>
  );
}

function CenteredStatus({ text, loading, error }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      {loading && (
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      )}
      <p className={`font-bold tracking-tight ${error ? "text-red-400" : "text-indigo-400 animate-pulse"}`}>
        {text}
      </p>
      {error && (
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
