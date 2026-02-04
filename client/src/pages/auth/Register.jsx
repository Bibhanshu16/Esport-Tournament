import { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message || "Registration Successful!");
      localStorage.setItem("pendingEmailVerification", form.email);
      setTimeout(() => navigate("/verify-email-info"), 1500);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Server error");
      } else {
        setMessage("Network error. Server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -top-10 -right-10"></div>
      <div className="absolute w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] -bottom-10 -left-10"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">
            Create <span className="text-cyan-400">Account</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase font-mono tracking-tighter">
            Join the ranks of elite players
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. John 'Ace' Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white px-4 py-3 rounded-lg transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="recruit@arena.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white px-4 py-3 rounded-lg transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Security Key (Password)</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white px-4 py-3 rounded-lg transition-all"
              required
            />
          </div>

          {message && (
            <div className={`text-xs p-3 rounded font-bold text-center border ${
              message.toLowerCase().includes('success') 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
            }`}>
              {message.toUpperCase()}
            </div>
          )}

          <button
            disabled={loading}
            className="group relative mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all overflow-hidden"
          >
            <span className="relative z-10">{loading ? "Processing..." : "Deploy Profile"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all">
            Return to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
