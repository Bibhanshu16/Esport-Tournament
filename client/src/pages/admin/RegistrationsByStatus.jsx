import { useEffect, useState } from "react";
import api from "../../api/axios";
import RegistrationCard from "../../components/RegistrationCard.jsx";

export default function RegistrationsByStatus({ status, title }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchByStatus = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/admin/registrations", {
          params: { status }
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error(`Failed to fetch ${status} registrations`, err);
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchByStatus();
  }, [status]);

  if (loading) return <p>Loading {title.toLowerCase()}...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!registrations.length)
    return <p className="text-slate-400">No {title.toLowerCase()} yet.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {registrations.map((reg) => (
        <RegistrationCard key={reg.id} reg={reg} showActions={false} />
      ))}
    </div>
  );
}
