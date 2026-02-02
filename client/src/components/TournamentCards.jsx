import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { Calendar, Users, Trophy, Gamepad2 } from "lucide-react";

export default function TournamentCards() {
  const [activeTournament, setActiveTournament] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("/tournaments/active");
        setActiveTournament(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = (tournamentId) => {
    if (authLoading) return; // wait until auth is ready

    // Not logged in
    if (!user) {
      navigate("/login", {
        state: { from: `/tournaments/${tournamentId}` },
      });
      return;
    }

    // Email not verified
    if (!user.emailVerified) {
      navigate("/verify-email-info");
      return;
    }

    // All good
    navigate(`/tournaments/${tournamentId}/register`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center my-8">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Active Tournaments
          </h2>
          <p className="text-slate-400 mt-1">
            Join the fight and claim your glory.
          </p>
        </div>
        <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-500/20">
          {activeTournament.length} Live Now
        </span>
      </div>

      {activeTournament.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
          <p className="text-slate-500 text-lg">
            No active tournaments at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTournament.map((tournament) => (
            <div
              key={tournament.id}
              className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Prize Pool Badge */}
              <div className="absolute top-4 right-4 bg-green-500/10 text-green-400 text-xs font-bold px-2.5 py-1 rounded-md border border-green-500/20">
                {tournament.prizePool}
              </div>

              {/* Game Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-500">
                  <Gamepad2 size={20} />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {tournament.game}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {tournament.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-400 gap-2">
                  <Trophy size={14} className="text-slate-500" />
                  <span>
                    Format:{" "}
                    <span className="text-slate-200">{tournament.format}</span>
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-400 gap-2">
                  <Users size={14} className="text-slate-500" />
                  <span>
                    Slots:{" "}
                    <span className="text-slate-200">
                      {tournament.remainingSlots} remaining
                    </span>
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-400 gap-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span>
                    {new Date(tournament.startDateTime).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-800">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold">
                    Entry Fee
                  </p>
                  <p className="text-lg font-bold text-white">
                    ₹{tournament.entryFee}
                  </p>
                </div>
                <button
                  onClick={() => handleRegister(tournament.id)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
