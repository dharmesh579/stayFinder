import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaMapMarkerAlt,
  FaHotel,
  FaStar,
  FaRupeeSign,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
} from "react-icons/fa";

import { getListingById } from "../services/listingService";
import {
  getListingReviews,
  createReview,
  deleteReview,
} from "../services/reviewService";

import Loading from "../components/Loading";

function ListingDetails() {
  const { id } = useParams();

  

  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  

  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);

        setListing(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching listing",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        setReviewError("");

        const response = await getListingReviews(id);

        setReviews(response.data);
      } catch (err) {
        setReviewError(
          err.response?.data?.message ||
            "Something went wrong while fetching reviews.",
        );
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  

  const allImages = listing.mainImage?.url
    ? [
        {
          url: listing.mainImage.url,
          _id: "main-image",
        },
        ...(listing.images || []),
      ]
    : [];

  const currentImage = allImages[selectedImage];

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

 

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    const nights = difference / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const totalPrice = nights * (listing.price || 0);

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    console.log({
      listingId: listing._id,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
    });
  };

  

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      const response = await createReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviews((prev) => [response.data, ...prev]);

      setListing((prev) => ({
        ...prev,
        rating: response.data?.rating || prev.rating,
        reviewCount: (prev.reviewCount || 0) + 1,
      }));

      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          "Something went wrong while submitting your review.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setReviewError("");

      await deleteReview(reviewId);

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));

      setListing((prev) => ({
        ...prev,
        reviewCount: Math.max((prev.reviewCount || 0) - 1, 0),
      }));
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          "Something went wrong while deleting the review.",
      );
    }
  };


  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }


  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        {/* Breadcrumb */}

        <p className="text-sm text-gray-500 mb-5">
          Home
          <span className="mx-2">/</span>
          Listings
          <span className="mx-2">/</span>
          {listing.category}
        </p>

        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-3 text-gray-600">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />

                <span>
                  {listing.location}, {listing.country}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />

                {listing.reviewCount > 0 ? (
                  <span>
                    <strong>{listing.rating}</strong>
                    {" · "}
                    {listing.reviewCount} reviews
                  </span>
                ) : (
                  <span>New listing</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
            >
              <FaShareAlt />
              Share
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
            >
              <FaHeart />
              Save
            </button>
          </div>
        </div>

        {/* Main Image */}

        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm group">
          {currentImage && (
            <img
              src={currentImage.url}
              alt={listing.title}
              className="w-full h-[300px] sm:h-[450px] lg:h-[550px] object-cover"
            />
          )}

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePreviousImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {allImages.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
              {selectedImage + 1} / {allImages.length}
            </div>
          )}

          {allImages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLightbox(true)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
            >
              <FaExpand />

              <span className="hidden sm:inline">View Photos</span>
            </button>
          )}
        </div>

        {/* Gallery */}

        {allImages.length > 1 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>

              <span className="text-sm text-gray-500">
                {allImages.length} photos
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3">
              {allImages.map((image, index) => (
                <button
                  type="button"
                  key={image._id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 rounded-xl overflow-hidden transition ${
                    selectedImage === index
                      ? "ring-4 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-28 h-20 sm:w-36 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Property Information */}

            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Property Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaHotel className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Type</p>

                    <p className="font-semibold text-gray-800">
                      {listing.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>

                    <p className="font-semibold text-gray-800">
                      {listing.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50">
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheckCircle className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>

                    <p
                      className={`font-semibold ${
                        listing.isAvailable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {listing.isAvailable ? "Available" : "Booked"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this property
              </h2>

              <p className="text-gray-600 leading-8 text-lg">
                {listing.description}
              </p>
            </section>

            {/* Amenities */}

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                What this place offers
              </h2>

              {listing.amenities?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 py-3">
                      <FaCheckCircle className="text-blue-600" />

                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No amenities listed for this property.
                </p>
              )}
            </section>

            {/* Reviews */}

            <section className="border-t border-gray-200 pt-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reviews & Ratings
                  </h2>

                  <p className="text-gray-500 mt-1">
                    See what guests think about this property.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                    <FaStar className="text-yellow-500 text-xl" />
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {listing.rating || 0}
                    </p>

                    <p className="text-sm text-gray-500">
                      {listing.reviewCount || 0} reviews
                    </p>
                  </div>
                </div>
              </div>

              {reviewError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
                  {reviewError}
                </div>
              )}

              {/* Review List */}

              {reviewLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                  <FaStar className="text-yellow-400 text-3xl mx-auto" />

                  <h3 className="text-lg font-bold text-gray-900 mt-4">
                    No reviews yet
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Be the first person to review this property.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <article
                      key={review._id}
                      className="border border-gray-200 rounded-2xl p-5 bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {review.user?.avatar ? (
                            <img
                              src={review.user.avatar}
                              alt={review.user.fullName}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="text-blue-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.user?.fullName || "User"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />

                          <span className="font-semibold text-gray-800">
                            {review.rating}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}

                      <div className="flex gap-1 mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {/* Comment */}

                      <p className="text-gray-600 leading-7 mt-3">
                        {review.comment}
                      </p>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-sm text-red-500 hover:text-red-700 mt-4"
                      >
                        Delete Review
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {/* Write Review */}

              <div className="border-t border-gray-200 mt-10 pt-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Write a Review
                </h3>

                <p className="text-gray-500 mt-1 mb-6">
                  Share your experience with other guests.
                </p>

                <form onSubmit={handleSubmitReview}>
                  {/* Rating */}

                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Rating
                    </label>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition hover:scale-110"
                        >
                          <FaStar
                            className={`text-2xl ${
                              star <= reviewRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}

                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Review
                    </label>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={5}
                      minLength={5}
                      maxLength={500}
                      placeholder="Tell other guests about your experience..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-400 mt-2 text-right">
                      {reviewComment.length}/500
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </section>

            {/* Host */}

            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Meet your host
              </h2>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {listing.owner?.avatar ? (
                  <img
                    src={listing.owner.avatar}
                    alt={listing.owner.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="text-blue-600 text-3xl" />
                  </div>
                )}

                <div className="text-center sm:text-left">
                  <p className="text-xl font-bold text-gray-900">
                    {listing.owner?.fullName || "Host"}
                  </p>

                  <p className="text-gray-500 mt-1">Your StayFinder host</p>

                  {listing.owner?.email && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-gray-600">
                      <FaEnvelope className="text-blue-600" />

                      <span>{listing.owner.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Booking Card */}

          <aside>
            <div className="lg:sticky lg:top-6 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-baseline gap-2">
                <FaRupeeSign className="text-blue-600" />

                <span className="text-3xl font-bold text-gray-900">
                  {listing.price}
                </span>

                <span className="text-gray-500">/ night</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm">
                <FaStar className="text-yellow-500" />

                {listing.reviewCount > 0 ? (
                  <span>
                    {listing.rating} · {listing.reviewCount} reviews
                  </span>
                ) : (
                  <span className="text-gray-500">New listing</span>
                )}
              </div>

              {/* Dates */}

              <div className="border border-gray-300 rounded-xl overflow-hidden mt-6">
                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-gray-300">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                      Check-in
                    </label>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />

                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                      Check-out
                    </label>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />

                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guests */}

              <div className="border border-gray-300 rounded-xl p-4 mt-4">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Guests
                </label>

                <div className="flex items-center gap-3">
                  <FaUsers className="text-blue-600" />

                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Price */}

              {nights > 0 && (
                <div className="border-t border-gray-200 mt-6 pt-5">
                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>
                      ₹{listing.price} × {nights} nights
                    </span>

                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>

                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Reserve */}

              <button
                type="button"
                onClick={handleReserve}
                disabled={!listing.isAvailable}
                className={`w-full mt-6 py-3.5 rounded-xl font-bold text-lg transition ${
                  listing.isAvailable
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {listing.isAvailable ? "Reserve Now" : "Currently Unavailable"}
              </button>

              {listing.isAvailable && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  You won't be charged yet.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}

      {showLightbox && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            aria-label="Close gallery"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <FaTimes className="text-xl" />
          </button>

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handlePreviousImage}
              aria-label="Previous image"
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}

          <div className="max-w-6xl max-h-[90vh] px-16 flex flex-col items-center">
            <img
              src={currentImage.url}
              alt={listing.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            <p className="text-white mt-4 text-sm">
              {selectedImage + 1} / {allImages.length}
            </p>
          </div>

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default ListingDetails;
