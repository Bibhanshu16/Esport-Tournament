import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Info, Users, CreditCard, Gamepad } from "lucide-react"; // Optional icons

export default function TournamentRegister() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const fetchTournament = async () => {
    try {
      const res = await api.get(`/tournaments/${id}`);
      setTournament(res.data);
      let count = 1;
      if (res.data.format === "DUO") count = 2;
      if (res.data.format === "SQUAD") count = 4;

      setPlayers(
        Array.from({ length: count }, () => ({
          name: "",
          email: "",
          phone: "",
          inGameName: ""
        }))
      );
    } catch (err) {
      setError("Tournament not found");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ tournamentId: id, teamName, players });
    alert("Registration data ready (payment step next)");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-indigo-400 font-medium">Loading Arena...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500">
        {error}
      </div>
    </div>
  );

  // Common Input Style
  const inputClass = "w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none p-3 rounded-xl text-white transition-all placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
            Tournament Entry
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Secure your slot in the upcoming battle</p>
        </div>

        <div className="space-y-8">
          {/* TOURNAMENT INFO CARD */}
          <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Gamepad size={120} />
            </div>
            
            <div className="relative z-10">
              <span className="bg-indigo-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Live Registration</span>
              <h2 className="text-2xl font-bold mt-2 text-indigo-400">{tournament.title}</h2>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Game" value={tournament.game} />
                <InfoItem label="Format" value={tournament.format} />
                <InfoItem label="Fee" value={`₹${tournament.entryFee}`} />
                <InfoItem label="Available" value={tournament.remainingSlots} />
              </div>
            </div>
          </div>

          {/* REGISTRATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Team Information</h2>
              </div>

              {tournament.format !== "SOLO" && (
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Team Name</label>
                  <input
                    type="text"
                    placeholder="Enter team squad name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              )}

              {/* PLAYER LIST */}
              <div className="space-y-8">
                {players.map((player, index) => (
                  <div key={index} className="relative pt-6 border-t border-slate-800 first:border-0 first:pt-0">
                    <span className="absolute -top-3 left-6 bg-slate-950 px-3 text-xs font-bold text-indigo-500 uppercase tracking-widest border border-slate-800 rounded-full">
                      Player {index + 1} {index === 0 && "(Captain)"}
                    </span>
                    
                    <div className="grid md:grid-cols-2 gap-5 mt-4">
                      <div className="space-y-1">
                        <input placeholder="Full Name" value={player.name} onChange={(e) => handlePlayerChange(index, "name", e.target.value)} required className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <input placeholder="In-game Name (IGN)" value={player.inGameName} onChange={(e) => handlePlayerChange(index, "inGameName", e.target.value)} required className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <input type="email" placeholder="Email Address" value={player.email} onChange={(e) => handlePlayerChange(index, "email", e.target.value)} required className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <input placeholder="Phone Number" value={player.phone} onChange={(e) => handlePlayerChange(index, "phone", e.target.value)} required className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="group relative w-full overflow-hidden bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase tracking-widest text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span>Proceed to Payment</span>
                <CreditCard size={20} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Small helper for Info Items
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</p>
      <p className="text-white font-bold">{value}</p>
    </div>
  );
}