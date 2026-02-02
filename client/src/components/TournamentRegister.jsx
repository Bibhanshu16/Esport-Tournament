import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { Users, CreditCard, Gamepad } from "lucide-react";

export default function TournamentRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // 1️⃣ Tournament info
      const tRes = await api.get(`/tournaments/${id}`);
      setTournament(tRes.data);

      // 2️⃣ Check if already registered
      try {
        const rRes = await api.get(`/registrations/my/${id}`);
        setRegistration(rRes.data);
        return; // ✅ stop here if registered
      } catch {
        // Not registered → continue to form
      }

      // 3️⃣ Prepare player slots
      let count = 1;
      if (tRes.data.format === "DUO") count = 2;
      if (tRes.data.format === "SQUAD") count = 4;

      setPlayers(
        Array.from({ length: count }, () => ({
          name: "",
          email: "",
          phone: "",
          inGameName: "",
        }))
      );
    } catch {
      setError("Tournament not found");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (i, field, value) => {
    const updated = [...players];
    updated[i][field] = value;
    setPlayers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/payment", {
      state: {
        tournamentId: tournament.id,
        teamName: tournament.format === "SOLO" ? "SOLO" : teamName,
        players,
        amount: tournament.entryFee,
      },
    });
  };

  if (loading)
    return <Centered text="Loading Arena..." />;

  if (error)
    return <Centered error={error} />;

  /* =======================
     🟡 PENDING REGISTRATION
     ======================= */
  if (registration && registration.status === "PENDING") {
    return (
      <Centered>
        <StatusCard
          title="Registration Pending"
          text="Waiting for admin approval"
          status="PENDING"
          onClick={() => navigate("/profile")}
        />
      </Centered>
    );
  }

  /* =======================
     🟢 APPROVED REGISTRATION
     ======================= */
  if (registration && registration.status === "APPROVED") {
    const { tournament, teamMembers, teamName, spotNumber } = registration;

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">
          {tournament.title}
        </h1>

        <InfoGrid
          items={[
            ["Game", tournament.game],
            ["Format", tournament.format],
            ["Prize Pool", tournament.prizePool],
            ["Slot Number", spotNumber],
            ["Team Name", teamName],
            ["Start Time", new Date(tournament.startDateTime).toLocaleString()],
          ]}
        />

        {tournament.rules && (
          <Section title="Rules">{tournament.rules}</Section>
        )}

        <Section title="Team Members">
          {teamMembers.map((m, i) => (
            <div key={m.id} className="bg-slate-900 p-4 rounded-xl mb-3">
              <p className="font-bold">
                {i + 1}. {m.name}
              </p>
              <p className="text-slate-400 text-sm">IGN: {m.inGameName}</p>
              <p className="text-slate-400 text-sm">Email: {m.email}</p>
              <p className="text-slate-400 text-sm">Phone: {m.phone}</p>
            </div>
          ))}
        </Section>
      </div>
    );
  }

  /* =======================
     🔵 REGISTRATION FORM
     ======================= */
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-center text-indigo-400 mb-10">
          Tournament Entry
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {tournament.format !== "SOLO" && (
            <input
              className={inputClass}
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          )}

          {players.map((p, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4">
              <input className={inputClass} placeholder="Name" required
                onChange={e => handlePlayerChange(i,"name",e.target.value)} />
              <input className={inputClass} placeholder="IGN" required
                onChange={e => handlePlayerChange(i,"inGameName",e.target.value)} />
              <input className={inputClass} placeholder="Email" required
                onChange={e => handlePlayerChange(i,"email",e.target.value)} />
              <input className={inputClass} placeholder="Phone" required
                onChange={e => handlePlayerChange(i,"phone",e.target.value)} />
            </div>
          ))}

          <button className="btn-primary">
            Proceed to Payment <CreditCard size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* =======================
   🔧 HELPERS
   ======================= */

const inputClass =
  "w-full bg-slate-900 border border-slate-700 p-3 rounded-xl";

function Centered({ children, text, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      {children || (
        <div className="text-red-500">{error || text}</div>
      )}
    </div>
  );
}

function StatusCard({ title, text, status, onClick }) {
  return (
    <div className="bg-slate-900 p-8 rounded-xl text-center">
      <h2 className="text-2xl font-bold text-indigo-400 mb-2">{title}</h2>
      <p className="text-slate-400 mb-4">{text}</p>
      <span className="badge">{status}</span>
      <button onClick={onClick} className="btn-primary mt-6">
        Go to Profile
      </button>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {items.map(([l, v]) => (
        <div key={l}>
          <p className="text-xs text-slate-400">{l}</p>
          <p className="font-bold">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}
