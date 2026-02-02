import PendingRegistrations from "./PendingRegistrations";
import CreateTournament from "./CreateTournament.jsx";


export default function Admin() {
  
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 md:px-12 lg:px-24">
      {/* HEADER SECTION */}
      <header className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Command <span className="text-purple-500">Center</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">
            System Administration & Tournament Control
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs font-bold uppercase text-slate-400">
            Status: <span className="text-emerald-400 text-[10px] ml-2 animate-pulse">● System Live</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MANAGEMENT & REGISTRATIONS */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-purple-500"></div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Pending Approvals</h2>
            </div>
            <PendingRegistrations />
          </section>
        </div>

        {/* RIGHT COLUMN: ACTIONS & CREATION */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm border-t-purple-500/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-cyan-500"></div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-cyan-400">Deploy New Tournament</h2>
            </div>
            <CreateTournament />
          </section>

          {/* QUICK STATS PLACEHOLDER */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase font-bold">Total Players</p>
              <p className="text-2xl font-black text-white italic">1,284</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase font-bold">Active Events</p>
              <p className="text-2xl font-black text-purple-500 italic">12</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}