import { useState } from "react";

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

function SearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location, category, maxPrice, sort });
  };

  const handleReset = () => {
    setLocation("");
    setCategory("");
    setMaxPrice("");
    setSort("newest");
    onSearch?.({ location: "", category: "", maxPrice: "", sort: "newest" });
  };

  const inputStyle =
    "w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section id="search" className="max-w-7xl mx-auto px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
      >
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, country or name"
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Property Type
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputStyle} cursor-pointer`}
          >
            <option value="">All types</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium mb-2">
            Max price / night (₹)
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 5000"
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium mb-2">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`${inputStyle} cursor-pointer`}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 h-12 cursor-pointer bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-12 cursor-pointer border border-gray-300 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default SearchBar;
