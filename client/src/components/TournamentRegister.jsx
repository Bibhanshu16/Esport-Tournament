import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { 
  Users, 
  CreditCard, 
  Gamepad, 
  Info, 
  Shield, 
  Trophy, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

const inputClass =
  "w-full bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-slate-200";

export default function TournamentRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const tRes = await api.get(`/tournaments/${id}`);
      setTournament(tRes.data);

      try {
        const checkRes = await api.get(`/registrations/check/${id}`);
        if (checkRes.data?.registered) {
          const status = checkRes.data.status;
          if (status === "APPROVED") {
            const rRes = await api.get(`/registrations/my/${id}`);
            setRegistration(rRes.data);
          } else {
            setRegistration({ status });
          }
          return;
        }
      } catch { /* Not registered or check failed */ }

      let count = 1;
      if (tRes.data.format === "DUO") count = 2;
      if (tRes.data.format === "SQUAD") count = 4;

      setPlayers(Array.from({ length: count }, () => ({
        name: "", email: "", phone: "", inGameName: "",
      })));
    } catch {
      setError("Tournament not found.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [loadData]);

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = players.map((player, i) => 
      i === index ? { ...player, [field]: value } : player
    );
    setPlayers(updatedPlayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    navigate("/payment", {
      state: {
        tournamentId: tournament.id,
        teamName: tournament.format === "SOLO" ? "SOLO" : teamName,
        players,
        amount: tournament.entryFee,
        upiId: tournament.upiId,
        tournamentTitle: tournament.title
      },
    });
  };

  if (loading) return <Centered text="Initializing Arena Systems..." />;
  if (error) return <Centered error={error} />;

  if (registration && registration.status === "PENDING") {
    return (
      <Centered>
        <StatusCard
          title="Registration Pending"
          text="Marshals are verifying your entry. Check your profile for updates."
          status="PENDING"
          onClick={() => navigate("/profile")}
        />
      </Centered>
    );
  }

  if (registration && registration.status === "REJECTED") {
    return (
      <Centered>
        <StatusCard
          title="Registration Rejected"
          text="Your registration was rejected by the admins. Please contact support or review the tournament rules."
          status="REJECTED"
          onClick={() => navigate("/profile")}
        />
      </Centered>
    );
  }

  if (registration && registration.status === "APPROVED") {
    const { tournament, teamMembers, teamName, spotNumber } = registration;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-tight">{tournament.title}</h1>
              <p className="text-slate-400 mt-2 flex items-center gap-2 font-mono text-sm">
                <CheckCircle2 size={16} className="text-emerald-500" /> ENTRY CONFIRMED
              </p>
            </div>
            <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-lg text-right">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Your Slot</p>
              <p className="text-2xl font-black text-white">#{spotNumber}</p>
            </div>
          </header>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <InfoGrid items={[
                  ["Format", tournament.format],
                  ["Prize Pool", tournament.prizePool],
                  ["Team Name", teamName],
                  ["Start Date", new Date(tournament.startDateTime).toLocaleDateString()],
              ]} />
              <Section icon={<Shield className="text-indigo-400" />} title="Rules & Intelligence">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-slate-400 leading-relaxed whitespace-pre-line text-sm">
                  {tournament.rules || "No specific rules provided."}
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2"><Users size={16} /> Active Roster</h3>
              {teamMembers.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl group hover:border-indigo-500/50 transition-colors">
                  <p className="font-bold text-slate-100">{m.name}</p>
                  <p className="text-xs text-indigo-400 font-mono mt-1 uppercase">IGN: {m.inGameName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-1000">
        
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-4">New Registration</div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic uppercase">Battle <span className="text-indigo-500">Registry</span></h1>
          <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">{tournament.title} • {tournament.game}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. TEAM IDENTITY SECTION */}
          {tournament.format !== "SOLO" && (
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-indigo-500/20 shadow-xl">
              <label className="block text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-[0.2em]">Team Identity</label>
              <input
                className={inputClass}
                placeholder="Enter unique team name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
          )}

          {/* 2. PLAYER DETAILS SECTION */}
          <div className="space-y-6">
            <h3 className="text-xl font-black border-l-4 border-indigo-600 pl-4 uppercase tracking-tight">Roster Details</h3>
            <div className="grid gap-6">
              {players.map((p, i) => (
                <div key={i} className="relative group bg-slate-900/30 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5">
                  <span className="absolute -top-3 left-6 bg-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Player {i + 1} {i === 0 && "• Team Captain"}
                  </span>
                  <div className="grid md:grid-cols-2 gap-5 mt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase ml-1">Full Name</p>
                      <input className={inputClass} placeholder="John Doe" value={p.name} required onChange={(e) => handlePlayerChange(i, "name", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase ml-1">In-Game Name</p>
                      <input className={inputClass} placeholder="ProPlayer_99" value={p.inGameName} required onChange={(e) => handlePlayerChange(i, "inGameName", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase ml-1">Email Address</p>
                      <input className={inputClass} type="email" placeholder="email@example.com" value={p.email} required onChange={(e) => handlePlayerChange(i, "email", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase ml-1">Mobile Number</p>
                      <input className={inputClass} type="tel" placeholder="+91 00000 00000" value={p.phone} required onChange={(e) => handlePlayerChange(i, "phone", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. RULES AND CONSENT SECTION (MOVED HERE) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3 relative">
              <Shield size={20} className="text-indigo-400" />
              <h3 className="font-bold text-sm uppercase tracking-widest">Tournament Terms & Fair Play</h3>
            </div>
            <div className="p-6 max-h-40 overflow-y-auto text-slate-400 text-sm leading-relaxed custom-scrollbar bg-slate-950/20 font-light italic relative">
              {tournament.rules || "Standard fair play rules apply. No cheating allowed."}
            </div>
            <div className="p-4 bg-indigo-500/5 border-t border-slate-800 relative">
              <label className="flex items-center gap-3 cursor-pointer group/label">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-all"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-300 group-hover/label:text-white transition-colors">
                  I confirm that all team details are correct and I agree to the rules.
                </span>
              </label>
            </div>
          </div>

          {/* 4. SUBMISSION ACTION */}
          <div className="space-y-4 pt-6">
            {!agreed && (
              <p className="text-center text-amber-500/80 text-[10px] font-bold uppercase flex items-center justify-center gap-2 tracking-widest">
                <AlertCircle size={14} /> Agreement Required to Unlock Checkout
              </p>
            )}
            <button
              disabled={!agreed}
              className={`w-full font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform tracking-widest text-sm
                ${agreed 
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-indigo-500/40" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"}`}
            >
              PROCEED TO SECURE CHECKOUT <CreditCard size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Helpers remain the same ---
function Centered({ children, text, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-mono">
      {children || (
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <div className={error ? "text-red-400" : "text-indigo-400 animate-pulse tracking-widest uppercase text-sm"}>
            {error || text}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({ title, text, status, onClick }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[2rem] text-center max-w-sm shadow-2xl">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-indigo-500/30">
        <Info className="text-indigo-500" size={40} />
      </div>
      <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">{title}</h2>
      <p className="text-slate-400 mb-10 text-sm leading-relaxed">{text}</p>
      <div className="inline-block bg-slate-950 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] text-indigo-400 border border-indigo-500/30 mb-10">
        {status}
      </div>
      <button onClick={onClick} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs">
        Return to Dashboard
      </button>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(([l, v]) => (
        <div key={l} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">{l}</p>
          <p className="font-bold text-slate-100">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-100">{icon} {title}</h2>
      {children}
    </div>
  );
}
