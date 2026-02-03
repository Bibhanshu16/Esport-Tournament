import { useEffect, useState } from "react";
import api from "../../api/axios";

const inputClass =
  "w-full bg-slate-950/50 border border-slate-700/60 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-slate-200";

export default function BroadcastEmail() {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentId, setTournamentId] = useState("");
  const [status, setStatus] = useState("APPROVED");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get("/tournaments");
        setTournaments(res.data);
      } catch (err) {
        console.error("Failed to load tournaments", err);
        setError("Unable to load tournaments");
      }
    };

    fetchTournaments();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!tournamentId || !subject || !message) {
      setError("Please select a tournament and fill subject/message.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/broadcast-email", {
        tournamentId,
        subject,
        message,
        status
      });
      setInfo(`Sent to ${res.data?.sent || 0} team leaders.`);
      setMessage("");
    } catch (err) {
      console.error("Send email failed", err);
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <label className="text-xs uppercase text-slate-500 font-bold">
          Tournament
        </label>
        <select
          className={inputClass}
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
        >
          <option value="">Select a tournament</option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase text-slate-500 font-bold">
          Participants
        </label>
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="APPROVED">Approved Teams</option>
          <option value="PENDING">Pending Teams</option>
          <option value="ALL">All Registered (Pending + Approved)</option>
        </select>
      </div>

      <div>
        <label className="text-xs uppercase text-slate-500 font-bold">
          Subject
        </label>
        <input
          className={inputClass}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Match room details"
        />
      </div>

      <div>
        <label className="text-xs uppercase text-slate-500 font-bold">
          Message
        </label>
        <textarea
          className={`${inputClass} min-h-[140px]`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your announcement..."
        />
      </div>

      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      {info ? <p className="text-emerald-400 text-sm">{info}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-black py-3 rounded-xl transition-all tracking-widest text-xs uppercase ${
          loading
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
        }`}
      >
        {loading ? "Sending..." : "Send Email"}
      </button>
    </form>
  );
}
