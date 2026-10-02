import { useState, useRef } from "react";
import { createListing } from "../services/listingService";

function CreateListing() {
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
    price: 0,
    country: "",
    location: "",
    category: "",
    amenities: [],
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  function handleAmenityChange(e) {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((x) => x !== value),
    }));
  }
  function handleMainImageChange(e) {
    setMainImage(e.target.files[0]);
  }
  function handleGalleryImagesChange(e) {
    setGalleryImages((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  }
  function handleRemoveGalleryChanges(imageIndex) {
    setGalleryImages(galleryImages.filter((_, index) => index !== imageIndex));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("country", formData.country);
      data.append("location", formData.location);
      data.append("category", formData.category);
      formData.amenities.forEach((amenity) => {
        data.append("amenities", amenity);
      });
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      galleryImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await createListing(data);
      setSuccess(response.message);
      setFormData({
        title: "",
        description: "",
        price: 0,
        country: "",
        location: "",
        category: "",
        amenities: [],
      });
      setMainImage(null);
      setGalleryImages([]);
      mainImageRef.current.value = "";
      galleryImagesRef.current.value = "";
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong.Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Listing</h1>
        <form onSubmit={handleSubmit}>
          {/* BASIC INFORMATION */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-5 border-b pb-2">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter listing title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Describe your property"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Price Per Night (₹)
                </label>

                <input
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  id="price"
                  name="price"
                  min="1"
                  required
                  placeholder="Enter price per night"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-5 border-b pb-2">
              Location
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="country"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Country
                </label>

                <input
                  type="text"
                  id="country"
                  name="country"
                  onChange={handleChange}
                  value={formData.country}
                  required
                  placeholder="Enter country"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Location
                </label>

                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={handleChange}
                  value={formData.location}
                  required
                  placeholder="Enter city/location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-5 border-b pb-2">
              Category
            </h2>

            <label
              htmlFor="category"
              className="block mb-2 font-medium text-gray-700"
            >
              Property Type
            </label>

            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Category
              </option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* AMENITIES */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-5 border-b pb-2">
              Amenities
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer"
                  ref={galleryImagesRef}
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    className="w-4 h-4 accent-blue-600"
                    onChange={handleAmenityChange}
                    checked={formData.amenities.includes(amenity)}
                  />

                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-5 border-b pb-2">Images</h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="mainImage"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Main Image
                </label>

                <input
                  ref={mainImageRef}
                  type="file"
                  id="mainImage"
                  name="mainImage"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg hover:file:bg-blue-700"
                />
                {mainImage && (
                  <div>
                    <img
                      src={URL.createObjectURL(mainImage)}
                      alt="Main Preview"
                      className="mt-4 w-72 h-48 object-cover rounded-lg border shadow"
                    />
                    <button
                      className="text-center bg-red-600 text-white font-semibold w-72 rounded-xl border-2 mt-2 shadow hover:bg-red-700 hover:scale-110 cursor-pointer"
                      onClick={() => {
                        setMainImage(null);
                        mainImageRef.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="images"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Gallery Images
                </label>

                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleGalleryImagesChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg hover:file:bg-blue-700"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {galleryImages.map((galleryImage, index) => (
                    <div key={index}>
                      <img
                        src={URL.createObjectURL(galleryImage)}
                        alt={`Gallery ${index + 1}`}
                        className="w-40 h-32 object-cover rounded-lg border shadow"
                      />
                      <button
                        className="text-center bg-red-600 text-white font-semibold w-40 rounded-xl border-2 mt-2 shadow hover:bg-red-700 hover:scale-110 cursor-pointer"
                        onClick={() => handleRemoveGalleryChanges(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {error && (
            <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
          )}

          {success && (
            <p className="mb-4 text-center text-green-600 font-medium">
              {success}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateListing;
