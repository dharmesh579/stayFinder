import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
} from "react-icons/fa";

import { getMyListings, deleteListing } from "../services/listingService";
import Loading from "../components/Loading";
import { formatPrice } from "../utils/format";

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await getMyListings();
        setListings(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load your listings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  const handleDelete = async (listing) => {
    if (
      !window.confirm(
        `Delete "${listing.title}"? This will also remove its reviews and bookings.`,
      )
    ) {
      return;
    }

    setDeletingId(listing._id);
    try {
      await deleteListing(listing._id);
      setListings((prev) => prev.filter((item) => item._id !== listing._id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">
            {listings.length} {listings.length === 1 ? "property" : "properties"}
          </p>
        </div>

        <Link
          to="/create-listing"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add New Listing
        </Link>
      </div>

      {error && <p className="text-red-600 mb-6">{error}</p>}

      {!error && listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-500 text-lg mb-4">
            You haven&apos;t listed any properties yet.
          </p>
          <Link to="/create-listing" className="text-blue-600 font-semibold">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md flex flex-col"
            >
              <img
                src={listing.mainImage?.url}
                alt={listing.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {listing.category}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      listing.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {listing.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mt-3 line-clamp-1">
                  {listing.title}
                </h2>

                <p className="flex items-center gap-2 text-gray-500 mt-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  {listing.location}, {listing.country}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <p className="flex items-center gap-2 text-gray-700">
                    <FaStar className="text-yellow-500" />
                    {listing.reviewCount > 0
                      ? `${listing.rating} (${listing.reviewCount})`
                      : "No reviews"}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(listing.price)}
                    <span className="text-sm text-gray-500 font-normal">
                      {" "}
                      / night
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-gray-100">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                  >
                    <FaEye />
                    View
                  </Link>
                  <Link
                    to={`/edit-listing/${listing._id}`}
                    className="flex items-center justify-center gap-2 border border-blue-300 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    <FaEdit />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(listing)}
                    disabled={deletingId === listing._id}
                    className="flex items-center justify-center gap-2 border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition text-sm cursor-pointer disabled:opacity-50"
                  >
                    <FaTrash />
                    {deletingId === listing._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyListings;
