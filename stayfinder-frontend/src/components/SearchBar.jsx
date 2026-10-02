import { useState } from "react";

function SearchBar() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState(0);

  const handleSearch = () => {
    console.log({ location, propertyType, budget });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 ">
      <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Loction
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium mb-2"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select Property</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="PG">PG</option>
            <option value="House">House</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="budget" className="block text-sm font-medium mb-2">
            Budget
          </label>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="10000"
            id="budget"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 opacity-0 ">
            Search
          </label>
          <button
            onClick={handleSearch}
            className="w-full h-12 cursor-pointer bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
