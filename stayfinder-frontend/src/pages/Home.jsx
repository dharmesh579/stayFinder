import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCalendarCheck,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

import Hero from "../components/Hero.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ListingCard from "../components/ListingCard.jsx";
import Loading from "../components/Loading.jsx";
import { getAllListings } from "../services/listingService.js";

const CATEGORIES = [
  "Apartment",
  "Villa",
  "Cabin",
  "Hotel",
  "Resort",
  "Beach",
  "Mountain",
  "Camping",
  "Farmhouse",
  "Treehouse",
];

const FEATURES = [
  {
    icon: FaSearch,
    title: "Find the right stay",
    text: "Filter by location, property type and budget to see only what fits.",
  },
  {
    icon: FaCalendarCheck,
    title: "Simple booking",
    text: "Pick your dates, send a request and the host confirms it.",
  },
  {
    icon: FaStar,
    title: "Honest reviews",
    text: "Read feedback from real guests before you decide.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure accounts",
    text: "Verified emails and protected logins keep your data safe.",
  },
];

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [searchBarKey, setSearchBarKey] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      setSearching(true);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== ""),
        );
        const response = await getAllListings(params);
        setListings(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching listings...",
        );
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };
    fetchListings();
  }, [filters]);

  // Category chip: replaces the filters and resets the search bar fields
  const handleCategory = (category) => {
    setFilters(category === filters.category ? {} : { category });
    setSearchBarKey((k) => k + 1);
  };

  if (loading) return <Loading />;

  const isFiltered = Object.values(filters).some(
    (v) => v !== "" && v !== "newest",
  );

  return (
    <>
      <Hero />

      {/* Search bar overlaps the bottom of the hero */}
      <div className="relative z-10 -mt-24">
        <SearchBar key={searchBarKey} onSearch={setFilters} />
      </div>

      {/* Category chips */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategory(category)}
              className={`shrink-0 px-5 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
                filters.category === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section
        id="listings"
        className="max-w-7xl mx-auto px-6 py-12"
        aria-busy={searching}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isFiltered ? "Search Results" : "Featured Properties"}
            </h2>
            <p className="text-gray-500 mt-1">
              {isFiltered
                ? "Stays matching your search"
                : "Hand-picked stays from our hosts"}
            </p>
          </div>
          {!error && (
            <span className="text-gray-500 text-sm">
              {listings.length}{" "}
              {listings.length === 1 ? "property" : "properties"} found
            </span>
          )}
        </div>

        {error ? (
          <p className="text-center py-10 text-red-600 text-xl">{error}</p>
        ) : listings.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
              searching ? "opacity-50" : ""
            }`}
          >
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-500 text-lg">No properties found.</p>
            {isFiltered && (
              <button
                onClick={() => {
                  setFilters({});
                  setSearchBarKey((k) => k + 1);
                }}
                className="mt-4 text-blue-600 font-semibold cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Why StayFinder */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why StayFinder?
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600 text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-blue-600 rounded-3xl px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">Have a property to rent out?</h2>
          <p className="mt-3 text-blue-100 max-w-xl mx-auto">
            List it on StayFinder, manage booking requests and start welcoming
            guests.
          </p>
          <Link
            to="/create-listing"
            className="inline-block mt-6 bg-white text-blue-600 font-semibold px-7 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Become a Host
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
