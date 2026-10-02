import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import { getListingById, updateListing } from "../services/listingService";

import Loading from "../components/Loading";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = [
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

  const amenities = [
    "WiFi",
    "Parking",
    "Pool",
    "Kitchen",
    "TV",
    "Air Conditioning",
    "Washing Machine",
    "Pets Allowed",
    "Free Breakfast",
    "Balcony",
    "Other",
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    category: "",
    amenities: [],
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);

        const listing = response.data;

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          country: listing.country || "",
          location: listing.location || "",
          category: listing.category || "",
          amenities: listing.amenities || [],
          isAvailable: listing.isAvailable ?? true,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching the listing.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }));
  };

  const handleAvailabilityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isAvailable: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateListing(id, formData);

      setSuccess(response.message || "Listing updated successfully.");

      setTimeout(() => {
        navigate(`/listing/${id}`);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while updating the listing.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <p className="text-red-600 text-lg text-center">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-10">
        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">Dashboard</p>

          <h1 className="text-4xl font-bold text-gray-900">Edit Listing</h1>

          <p className="text-gray-500 mt-2">
            Update the information about your property.
          </p>
        </div>

        {/* FORM CARD */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8"
        >
          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 rounded-xl p-4">
              {success}
            </div>
          )}

          {/* BASIC INFORMATION */}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            {/* TITLE */}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                minLength={5}
                maxLength={100}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                minLength={20}
                maxLength={2000}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PRICE */}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price per Night
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </section>

          {/* LOCATION */}

          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* COUNTRY */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* CATEGORY */}

          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Property Type
            </h2>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select property type
              </option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </section>

          {/* AMENITIES */}

          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition"
                >
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    className="w-4 h-4 accent-blue-600"
                  />

                  <FaCheckCircle className="text-blue-500" />

                  <span className="text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* AVAILABILITY */}

          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Availability
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={handleAvailabilityChange}
                className="w-5 h-5 accent-blue-600"
              />

              <span className="text-gray-700 font-medium">
                This property is currently available
              </span>
            </label>
          </section>

          {/* BUTTONS */}

          <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/listing/${id}`)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditListing;
