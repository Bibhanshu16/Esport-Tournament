import { useNavigate } from "react-router-dom";

export default function VerifyEmailSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl text-center max-w-md border border-slate-800">
        <h2 className="text-2xl font-bold mb-3">Email verified</h2>
        <p className="text-slate-400 mb-6">
          Your email has been verified successfully. You can now register for
          tournaments.
        </p>
        <button
          onClick={() => navigate("/tournaments")}
          className="w-full font-black py-3 rounded-xl transition-all tracking-widest text-xs uppercase bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          Go to Tournaments
        </button>
      </div>
    </div>
  );
}
