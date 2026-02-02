import { useEffect, useState } from "react";
import api from "../../api/axios";
import RegistrationCard from "../../components/RegistrationCard.jsx";

export default function PendingRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/pending-registrations");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Failed to fetch pending registrations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId, tournamentId) => {
    try {
      await api.post("/admin/approve", {
        registrationId,
        tournamentId,
      });

      // remove approved one from UI
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (registrationId) => {
    await api.post("/admin/reject", { registrationId });
    setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
  };

  if (loading) return <p>Loading pending registrations...</p>;

  if (!registrations.length)
    return <p className="text-slate-400">No pending registrations 🎉</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Pending Registrations</h2>

      {registrations.map((reg) => (
        <RegistrationCard
          key={reg.id}
          reg={reg}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
