import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/axios";
import RegistrationCard from "../../components/RegistrationCard.jsx";

export default function RegistrationsByStatus({ status, title }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

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

  const openDetails = async (id) => {
    setDetailsError("");
    setDetailsLoading(true);
    setSelected(null);
    try {
      const res = await api.get(`/admin/registration/${id}`);
      setSelected(res.data);
    } catch (err) {
      console.error("Failed to load registration details", err);
      setDetailsError("Failed to load registration details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setDetailsError("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {registrations.map((reg) => (
        <RegistrationCard
          key={reg.id}
          reg={reg}
          showActions={false}
          onOpen={openDetails}
        />
      ))}

      {detailsLoading || selected || detailsError ? (
        <DetailsModal
          data={selected}
          loading={detailsLoading}
          error={detailsError}
          onClose={closeDetails}
        />
      ) : null}
    </div>
  );
}

function DetailsModal({ data, loading, error, onClose }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-slate-700 rounded-3xl p-6 md:p-10 text-slate-100 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              Registration Details
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Admin View
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase font-bold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-slate-300">Loading details...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Tournament" value={data.tournament?.title} />
              <Info label="Game" value={data.tournament?.game} />
              <Info label="Format" value={data.tournament?.format} />
              <Info label="Entry Fee" value={`₹${data.tournament?.entryFee}`} />
              <Info label="Prize Pool" value={data.tournament?.prizePool} />
              <Info
                label="Start Time"
                value={new Date(data.tournament?.startDateTime).toLocaleString()}
              />
              <Info label="Team Name" value={data.teamName} />
              <Info label="Status" value={data.status} />
              <Info label="Spot" value={data.spotNumber ? `#${data.spotNumber}` : "—"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Leader Name" value={data.user?.name || "—"} />
              <Info label="Leader Email" value={data.user?.email || "—"} />
              <Info label="Leader Phone" value={data.user?.phone || "—"} />
              <Info label="UPI ID" value={data.tournament?.upiId || "—"} />
            </div>

            {data.payment ? (
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">
                  Payment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Amount" value={`₹${data.payment.amount}`} />
                  <Info label="Method" value={data.payment.paymentMethod} />
                  <Info label="Status" value={data.payment.status} />
                  <Info label="Transaction ID" value={data.payment.transactionId || "—"} />
                  <Info
                    label="Created"
                    value={new Date(data.payment.createdAt).toLocaleString()}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 text-slate-300">
                No payment record found for this registration.
              </div>
            )}

            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
              <h4 className="text-sm font-black uppercase tracking-widest mb-3">
                Team Members
              </h4>
              <div className="space-y-3">
                {data.teamMembers?.map((m, idx) => (
                  <div
                    key={m.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-4"
                  >
                    <p className="font-bold text-slate-100">
                      {idx + 1}. {m.name}
                    </p>
                    <p className="text-xs text-slate-400">IGN: {m.inGameName}</p>
                    <p className="text-xs text-slate-500">{m.email}</p>
                    <p className="text-xs text-slate-500">{m.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </div>,
    document.body
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
        {label}
      </p>
      <p className="font-bold text-slate-100 break-words">{value}</p>
    </div>
  );
}
