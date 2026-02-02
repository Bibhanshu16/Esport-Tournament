import { useState, useContext } from "react";
import api from "../../api/axios.js";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

import { useLocation } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  console.log("LOGIN location.state:", location.state);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Decorative Background Glows */}
      <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-[120px] top-1/4 left-1/4"></div>
      <div className="absolute w-64 h-64 bg-cyan-600/10 rounded-full blur-[120px] bottom-1/4 right-1/4"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 md:p-10 rounded-xl backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-widest text-white italic">
            Player <span className="text-purple-500">Login</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-mono uppercase">
            Enter your credentials to deploy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs uppercase font-bold text-slate-500 mb-1 ml-1 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="commander@esports.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white px-4 py-3 rounded-md transition-all font-sans"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-slate-500 mb-1 ml-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white px-4 py-3 rounded-md transition-all font-sans"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded text-center font-bold animate-pulse">
              ⚠️ {error.toUpperCase()}
            </div>
          )}

          <button
            disabled={loading}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-4 rounded-md uppercase tracking-widest transition-all transform active:scale-[0.98] shadow-lg shadow-purple-600/20"
          >
            {loading ? "Authorizing..." : "Initiate Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          New recruit?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-bold underline decoration-2 underline-offset-4"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
