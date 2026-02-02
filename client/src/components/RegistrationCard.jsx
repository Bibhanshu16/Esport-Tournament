export default function RegistrationCard({ reg, onApprove, onReject }) {
  return (
    <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/60">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-purple-400">
            {reg.teamName}
          </h3>
          <p className="text-sm text-slate-400">
            {reg.tournament.title} • {reg.user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onApprove(reg.id, reg.tournamentId)}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Approve
          </button>

          <button
            onClick={() => onReject(reg.id)}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
