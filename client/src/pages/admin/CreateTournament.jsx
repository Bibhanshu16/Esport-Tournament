import { useState } from "react";
import api from "../../api/axios";

export default function CreateTournament() {
  const [form, setForm] = useState({
    title: "",
    game: "",
    format: "SOLO",
    entryFee: 0,
    prizePool: "",
    maxSlots: 0,
    startDateTime: "",
    upiId: "",
    rules: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/create-tournaments", form);
      alert("Tournament created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create tournament");
    }
  };

  // Helper to keep the JSX clean
  const inputClass = "w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-none text-white px-4 py-2.5 rounded text-sm transition-all placeholder:text-slate-600";
  const labelClass = "text-[10px] uppercase font-bold text-slate-500 mb-1 block ml-1 tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelClass}>Tournament Title</label>
          <input 
            className={inputClass}
            placeholder="e.g. Pro League Season 1" 
            onChange={e => setForm({...form, title: e.target.value})}
            required
          />
        </div>

        {/* Game & Format */}
        <div>
          <label className={labelClass}>Game Name</label>
          <input 
            className={inputClass}
            placeholder="e.g. BGMI, Valorant" 
            onChange={e => setForm({...form, game: e.target.value})}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Match Format</label>
          <select 
            className={inputClass}
            onChange={e => setForm({...form, format: e.target.value})}
          >
            <option value="SOLO">SOLO</option>
            <option value="DUO">DUO</option>
            <option value="SQUAD">SQUAD</option>
          </select>
        </div>

        {/* Entry Fee & Prize Pool */}
        <div>
          <label className={labelClass}>Entry Fee (₹)</label>
          <input 
            type="number" 
            className={inputClass}
            placeholder="0 for Free" 
            onChange={e => setForm({...form, entryFee: e.target.value})}
          />
        </div>
        <div>
          <label className={labelClass}>Prize Pool</label>
          <input 
            className={inputClass}
            placeholder="e.g. ₹10,000" 
            onChange={e => setForm({...form, prizePool: e.target.value})}
          />
        </div>

        {/* Max Slots & Date */}
        <div>
          <label className={labelClass}>Max Slots</label>
          <input 
            type="number" 
            className={inputClass}
            placeholder="e.g. 100" 
            onChange={e => setForm({...form, maxSlots: e.target.value})}
          />
        </div>
        <div>
          <label className={labelClass}>Start Schedule</label>
          <input 
            type="datetime-local" 
            className={`${inputClass} custom-calendar-icon`}
            onChange={e => setForm({...form, startDateTime: e.target.value})}
          />
        </div>

        {/* UPI ID */}
        <div className="md:col-span-2">
          <label className={labelClass}>Payment UPI ID</label>
          <input 
            className={inputClass}
            placeholder="yourname@okicici" 
            onChange={e => setForm({...form, upiId: e.target.value})}
          />
        </div>

        {/* Rules */}
        <div className="md:col-span-2">
          <label className={labelClass}>Tournament Rules</label>
          <textarea
            className={`${inputClass} min-h-[110px]`}
            placeholder="Add rules, map, check-in time, and any special notes..."
            onChange={e => setForm({...form, rules: e.target.value})}
          />
        </div>
      </div>

      <button className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-sm rounded shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]">
        Create Tournament
      </button>
    </form>
  );
}
