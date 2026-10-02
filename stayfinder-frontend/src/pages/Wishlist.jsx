import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist } from "../services/wishlistService";
import ListingCard from "../components/ListingCard";
import Loading from "../components/Loading";

function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getWishlist();
        setListings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load wishlist");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 mb-4">No saved properties yet.</p>
          <Link to="/" className="text-blue-600 font-semibold">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
