import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";

function ListingCard({ listing }) {
  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition duration-300"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={listing.mainImage.url}
          alt={listing.title}
          className="w-full h-60 object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {listing.category}
        </span>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mt-3 line-clamp-1">
          {listing.title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <FaMapMarkerAlt className="text-red-500" />
          <span>
            {listing.location}, {listing.country}
          </span>
        </div>

        {/* Rating & Availability */}
        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />

            {listing.reviewCount > 0 ? (
              <span className="font-medium">
                {listing.rating} ({listing.reviewCount})
              </span>
            ) : (
              <span className="text-gray-500">New Listing</span>
            )}
          </div>

          <span
            className={`text-sm font-semibold ${
              listing.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {listing.isAvailable ? "Available" : "Booked"}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mt-6">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ₹{listing.price}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>

          <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
            <span>View</span>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
