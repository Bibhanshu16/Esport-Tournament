export default function RegistrationCard({
  reg,
  onApprove,
  onReject,
  showActions = true
}) {
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

        {showActions ? (
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
        ) : (
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-500 font-bold">
              Status
            </p>
            <p
              className={`text-sm font-bold ${
                reg.status === "APPROVED"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {reg.status}
            </p>
            {reg.status === "APPROVED" && reg.spotNumber ? (
              <p className="text-xs text-slate-400">Slot #{reg.spotNumber}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
