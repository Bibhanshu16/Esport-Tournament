import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function MyRegistrationDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/registrations/my/${id}`)
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 403)
          setError("Registration not approved yet");
        else
          setError("Unable to load registration");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const { tournament, teamMembers, spotNumber, teamName } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">
        {tournament.title}
      </h1>

      {/* Tournament Info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Info label="Game" value={tournament.game} />
        <Info label="Format" value={tournament.format} />
        <Info label="Prize Pool" value={tournament.prizePool} />
        <Info label="Start Time" value={new Date(tournament.startDateTime).toLocaleString()} />
        <Info label="Slot Number" value={spotNumber} />
        <Info label="Team Name" value={teamName} />
      </div>

      {tournament.rules && (
        <div className="mb-8">
          <h2 className="font-bold mb-2">Rules</h2>
          <p className="text-slate-300">{tournament.rules}</p>
        </div>
      )}

      {/* Team Members */}
      <h2 className="text-xl font-bold mb-3">Team Members</h2>
      <div className="space-y-3">
        {teamMembers.map((m, i) => (
          <div key={m.id} className="bg-slate-900 p-4 rounded-lg">
            <p className="font-bold">{i + 1}. {m.name}</p>
            <p className="text-sm text-slate-400">IGN: {m.inGameName}</p>
            <p className="text-sm text-slate-400">Email: {m.email}</p>
            <p className="text-sm text-slate-400">Phone: {m.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
