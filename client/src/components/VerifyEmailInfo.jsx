import { useState } from "react";
import api from "../api/axios";

export default function VerifyEmailInfo() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setInfo("");
    setError("");
    try {
      const res = await api.post("/auth/resend-verification");
      setInfo(res.data?.message || "Verification email sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="text-slate-400 mb-6">
          Please verify your email address before registering for tournaments.
          Check your inbox for the verification link.
        </p>

        {error ? <p className="text-red-400 text-sm mb-4">{error}</p> : null}
        {info ? <p className="text-emerald-400 text-sm mb-4">{info}</p> : null}

        <button
          onClick={handleResend}
          disabled={loading}
          className={`w-full font-black py-3 rounded-xl transition-all tracking-widest text-xs uppercase ${
            loading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
          }`}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}
