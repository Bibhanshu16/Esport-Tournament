import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { CheckCircle2, AlertCircle, XCircle, Trophy } from "lucide-react";

const inputClass =
  "w-full bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-slate-200";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userRes, regRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/registrations/me")
        ]);
        setUser(userRes.data);
        setForm({
          name: userRes.data?.name || "",
          phone: userRes.data?.phone || ""
        });
        setRegistrations(regRes.data || []);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const stats = useMemo(() => {
    const total = registrations.length;
    const approved = registrations.filter((r) => r.status === "APPROVED").length;
    const pending = registrations.filter((r) => r.status === "PENDING").length;
    const rejected = registrations.filter((r) => r.status === "REJECTED").length;
    return { total, approved, pending, rejected };
  }, [registrations]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setInfo("");

    try {
      const res = await api.put("/auth/me", {
        name: form.name.trim(),
        phone: form.phone.trim()
      });
      setUser(res.data);
      setForm({
        name: res.data?.name || "",
        phone: res.data?.phone || ""
      });
      setEditing(false);
      setInfo("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 md:px-12 lg:px-24">
      <header className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Player <span className="text-indigo-500">Profile</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">
            Account, Registrations, and Team Access
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs font-bold uppercase text-slate-400">
            Email:{" "}
            <span className="text-indigo-300 text-[10px] ml-2">
              {user?.email}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                Profile Details
              </h2>
              <button
                onClick={() => setEditing((v) => !v)}
                className="text-xs uppercase font-bold text-indigo-400 hover:text-indigo-300"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs uppercase text-slate-500 font-bold">
                  Name
                </label>
                <input
                  className={inputClass}
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-500 font-bold">
                  Phone
                </label>
                <input
                  className={inputClass}
                  value={form.phone}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 00000 00000"
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-500 font-bold">
                  Email
                </label>
                <input className={inputClass} value={user?.email || ""} disabled />
              </div>

              {error ? <p className="text-red-400 text-sm">{error}</p> : null}
              {info ? <p className="text-emerald-400 text-sm">{info}</p> : null}

              <button
                type="submit"
                disabled={!editing || saving}
                className={`w-full font-black py-3 rounded-xl transition-all tracking-widest text-xs uppercase ${
                  !editing || saving
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <Stat label="Applied" value={stats.total} />
            <Stat label="Approved" value={stats.approved} accent="text-emerald-400" />
            <Stat label="Pending" value={stats.pending} accent="text-amber-400" />
            <Stat label="Rejected" value={stats.rejected} accent="text-red-400" />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-indigo-500"></div>
              <h2 className="text-xl font-bold uppercase tracking-tight">
                My Tournament Applications
              </h2>
            </div>

            {!registrations.length ? (
              <p className="text-slate-400">No tournament applications yet.</p>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="border border-slate-800 rounded-xl p-5 bg-slate-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <Trophy size={16} className="text-indigo-400" />
                        {reg.tournament?.title}
                      </h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                        {reg.tournament?.game} • {reg.tournament?.format}
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Start:{" "}
                        {new Date(reg.tournament?.startDateTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        Team: {reg.teamName} • Members:{" "}
                        {reg.teamMembers?.length || 0}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={reg.status} />
                      {reg.status === "APPROVED" && reg.spotNumber ? (
                        <span className="text-xs text-slate-400">
                          Slot #{reg.spotNumber}
                        </span>
                      ) : null}
                      <button
                        onClick={() =>
                          navigate(
                            reg.status === "APPROVED"
                              ? `/tournaments/${reg.tournamentId}/my-registration`
                              : `/tournaments/${reg.tournamentId}/register`
                          )
                        }
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
                      >
                        {reg.status === "APPROVED" ? "View Details" : "View Status"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    APPROVED: {
      label: "Approved",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle2 size={14} />
    },
    PENDING: {
      label: "Pending",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: <AlertCircle size={14} />
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: <XCircle size={14} />
    }
  };
  const cfg = map[status] || map.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function Stat({ label, value, accent = "text-white" }) {
  return (
    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
      <p className="text-slate-500 text-[10px] uppercase font-bold">{label}</p>
      <p className={`text-2xl font-black italic ${accent}`}>{value}</p>
    </div>
  );
}
