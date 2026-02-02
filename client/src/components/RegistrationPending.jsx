export default function RegistrationPending() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold text-indigo-400">
          Registration Pending
        </h2>
        <p className="text-slate-400 mt-2">
          Your payment is under verification.  
          Admin approval pending.
        </p>
      </div>
    </div>
  );
}
