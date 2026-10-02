import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaEnvelope } from "react-icons/fa";
import {
  getHostBookings,
  updateBookingStatus,
} from "../services/bookingService";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import { formatDate, formatPrice } from "../utils/format";

function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHostBookings();
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatus = async (bookingId, status) => {
    try {
      const res = await updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? res.data : b)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update booking");
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm text-gray-500">
          No one has booked your listings yet.
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <Link
                    to={`/listing/${b.listing?._id}`}
                    className="text-xl font-bold text-gray-900 hover:text-blue-600"
                  >
                    {b.listing?.title || "Listing removed"}
                  </Link>
                  <p className="text-gray-600 mt-1">
                    Guest: <strong>{b.guest?.fullName}</strong>
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <FaEnvelope className="text-blue-600" />
                    {b.guest?.email}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-gray-600 text-sm">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  {formatDate(b.checkIn)} - {formatDate(b.checkOut)} ({b.nights}{" "}
                  {b.nights === 1 ? "night" : "nights"})
                </span>
                <span className="flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  {b.guests} {b.guests === 1 ? "guest" : "guests"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-blue-600">
                  {formatPrice(b.totalPrice)}
                </p>
                {b.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatus(b._id, "rejected")}
                      className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatus(b._id, "confirmed")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HostBookings;
