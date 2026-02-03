import { useEffect, useMemo, useState } from "react";
import TournamentCards from "../../components/TournamentCards.jsx";
import api from "../../api/axios";
import { Search, Filter, Flame, Calendar } from "lucide-react";

export default function Tournament() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("ALL");
  const [game, setGame] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/tournaments/active");
        setTournaments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tournaments", err);
        setError("Unable to load active tournaments.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const games = useMemo(() => {
    const set = new Set(tournaments.map((t) => t.game).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [tournaments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tournaments.filter((t) => {
      const matchesQuery =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.game?.toLowerCase().includes(q);
      const matchesFormat = format === "ALL" || t.format === format;
      const matchesGame = game === "ALL" || t.game === game;
      return matchesQuery && matchesFormat && matchesGame;
    });
  }, [tournaments, query, format, game]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 md:px-12 lg:px-24">
      <header className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Active <span className="text-indigo-500">Tournaments</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">
            Find your next match and lock your spot
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs font-bold uppercase text-slate-400">
            Live:{" "}
            <span className="text-emerald-400 text-[10px] ml-2">
              {filtered.length}
            </span>
          </div>
        </div>
      </header>

      {/* Search + Filters */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6">
            <label className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2 mb-2">
              <Search size={14} /> Search
            </label>
            <div className="relative">
              <input
                className="w-full bg-slate-950/50 border border-slate-700/60 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-slate-200 pl-10"
                placeholder="Search by title or game..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2 mb-2">
              <Filter size={14} /> Format
            </label>
            <select
              className="w-full bg-slate-950/50 border border-slate-700/60 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-200"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="SOLO">Solo</option>
              <option value="DUO">Duo</option>
              <option value="SQUAD">Squad</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2 mb-2">
              <Flame size={14} /> Game
            </label>
            <select
              className="w-full bg-slate-950/50 border border-slate-700/60 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-200"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              {games.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center my-8">
          {error}
        </div>
      ) : !filtered.length ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
          <div className="flex justify-center mb-4 text-slate-500">
            <Calendar size={28} />
          </div>
          <p className="text-slate-400 text-lg">No active tournaments found.</p>
          <p className="text-slate-500 text-sm mt-2">
            Try changing filters or search keywords.
          </p>
        </div>
      ) : (
        <TournamentCardsOverride tournaments={filtered} />
      )}
    </div>
  );
}

function TournamentCardsOverride({ tournaments }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TournamentCards items={tournaments} />
    </div>
  );
}
