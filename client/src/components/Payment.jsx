import { useLocation, useNavigate } from "react-router-dom";
import { QrCode, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Invalid payment session
      </div>
    );
  }

  const { tournamentId, teamName, players, amount } = state;

  const handleConfirmPayment = async () => {
    try {
      setConfirming(true);

      await api.post("/registrations/register", {
        tournamentId,
        teamName,
        teamMembers: players,
      });

      navigate("/registration-pending");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-indigo-400 text-center">
          Payment
        </h1>

        <p className="text-center text-4xl font-black mt-4">₹{amount}</p>

        <div className="bg-white p-4 rounded-lg flex justify-center my-6">
          <QrCode size={160} />
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={confirming}
          className="w-full bg-indigo-600 py-3 rounded-xl font-bold flex justify-center gap-2"
        >
          <CheckCircle />
          {confirming ? "Confirming..." : "I Have Paid"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 text-slate-400 flex justify-center gap-2"
        >
          <ArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
}
