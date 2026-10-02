import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import { formatDate, formatPrice } from "../utils/format";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? res.data : b)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel booking");
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 mb-4">You have no bookings yet.</p>
          <Link to="/" className="text-blue-600 font-semibold">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => {
            const canCancel =
              ["pending", "confirmed"].includes(b.status) &&
              new Date(b.checkOut) > new Date();
            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row"
              >
                <img
                  src={b.listing?.mainImage?.url}
                  alt={b.listing?.title}
                  className="w-full sm:w-56 h-44 sm:h-auto object-cover"
                />
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start gap-3">
                    <Link
                      to={`/listing/${b.listing?._id}`}
                      className="text-xl font-bold text-gray-900 hover:text-blue-600"
                    >
                      {b.listing?.title || "Listing removed"}
                    </Link>
                    <StatusBadge status={b.status} />
                  </div>

                  <p className="flex items-center gap-2 text-gray-500 mt-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {b.listing?.location}, {b.listing?.country}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-gray-600 text-sm">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      {formatDate(b.checkIn)} - {formatDate(b.checkOut)} (
                      {b.nights} {b.nights === 1 ? "night" : "nights"})
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
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      >
                        Cancel booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyBookings;
