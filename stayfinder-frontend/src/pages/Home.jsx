import Hero from "../components/Hero.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ListingCard from "../components/ListingCard.jsx";
import Loading from "../components/Loading.jsx";
import { getAllListings } from "../services/listingService.js";
import { useState, useEffect } from "react";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings();
        setListings(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching listings...",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">{error}</div>
    );
  }

  return (
    <>
      <Hero />
      <SearchBar />
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-gray-500">No Properties Found</h2>
        )}
      </section>
    </>
  );
}

export default Home;
