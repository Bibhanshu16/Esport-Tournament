import { useLocation, useNavigate } from "react-router-dom";
import { QrCode, CheckCircle, ArrowLeft, ShieldCheck, Copy, Info } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto text-red-500" size={48} />
          <p>Invalid payment session. Please restart registration.</p>
          <button onClick={() => navigate("/")} className="text-indigo-400 underline">Return Home</button>
        </div>
      </div>
    );
  }

  const { tournamentId, teamName, players, amount, upiId } = state;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    
    if (transactionId.length < 6) {
      alert("Please enter a valid Transaction ID/UTR number.");
      return;
    }

    try {
      setConfirming(true);

      // We send the transactionId so the backend can create the Payment record
      await api.post("/registrations/register", {
        tournamentId,
        teamName,
        teamMembers: players,
        transactionId, // Passing this to backend
      });

      // Redirect to a specific success/pending page
      navigate("/profile", { state: { message: "Registration submitted for verification!" } });
    } catch (err) {
      alert(err.response?.data?.message || "Verification submission failed");
      setConfirming(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId || "tournament@upi");
    alert("UPI ID copied!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500">
        
        <header className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Finalize <span className="text-indigo-500">Entry</span></h1>
          <p className="text-slate-400 text-sm mt-1">Complete the manual UPI transfer below</p>
        </header>

        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Payable Amount</p>
            <p className="text-4xl font-black text-white">₹{amount}</p>
          </div>

          <div className="bg-white p-3 rounded-xl flex justify-center mb-4">
            {/* Generate a real QR here or keep the icon for placeholder */}
            <QrCode size={180} className="text-slate-900" />
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="truncate mr-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase">UPI ID</p>
              <p className="text-sm font-mono text-indigo-300">{upiId || "gaming.arena@upi"}</p>
            </div>
            <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Copy size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 ml-1 tracking-widest">
              Transaction ID / UTR Number
            </label>
            <input
              type="text"
              required
              placeholder="Enter 12-digit Ref No."
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-center tracking-widest"
            />
            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
              <Info size={12} /> Enter the ID from your payment app (PhonePe/GPay/Paytm)
            </p>
          </div>

          <button
            type="submit"
            disabled={confirming}
            className={`w-full py-4 rounded-xl font-black flex justify-center items-center gap-2 transition-all transform active:scale-95
              ${confirming 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20"}`}
          >
            {confirming ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle size={20} /> I HAVE PAID
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-6 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase flex justify-center items-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} /> Edit Registration Details
        </button>
      </div>
    </div>
  );
}