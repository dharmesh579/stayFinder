import { useParams, useNavigate, Link } from "react-router-dom";
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
import { createBooking, getBookedDates } from "../services/bookingService";
import { toggleWishlist } from "../services/wishlistService";
import { useAuth } from "../context/useAuth";
import Reviews from "../components/Reviews";
import Loading from "../components/Loading";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [reserving, setReserving] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

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

  const refreshListing = async () => {
    try {
      const response = await getListingById(id);
      setListing(response.data);
    } catch {
      // keep showing the current data
    }
  };

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await getBookedDates(id);
        setBookedDates(response.data);
      } catch {
        setBookedDates([]);
      }
    };

    fetchBookedDates();
  }, [id]);

  // Create one array containing main image + gallery images
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

  const handleGalleryImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleOpenLightbox = () => {
    setShowLightbox(true);
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    const nights = difference / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const totalPrice = nights * (listing.price || 0);

  const today = new Date().toISOString().split("T")[0];

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : today;

  const datesConflict =
    nights > 0 &&
    bookedDates.some(
      (b) => new Date(checkIn) < new Date(b.checkOut) && new Date(checkOut) > new Date(b.checkIn),
    );

  const userId = user?._id || user?.id;
  const isOwner = Boolean(userId && listing.owner?._id === userId);
  const isSaved = Boolean(user?.wishlist?.includes(listing._id));

  const handleReserve = async () => {
    setBookingError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    if (datesConflict) {
      setBookingError("Those dates are already booked. Please choose others.");
      return;
    }

    setReserving(true);
    try {
      await createBooking(listing._id, { checkIn, checkOut, guests });
      navigate("/my-bookings");
    } catch (err) {
      setBookingError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Could not create booking. Please try again.",
      );
    } finally {
      setReserving(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await toggleWishlist(listing._id);
      setUser({ ...user, wishlist: response.data.wishlist });
    } catch (err) {
      alert(err.response?.data?.message || "Could not update wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied!");
        setTimeout(() => setShareMessage(""), 2000);
      }
    } catch {
      // share dialog dismissed
    }
  };

  if (loading) {
    return <Loading />;
  }

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
        {/* BREADCRUMB */}

        <p className="text-sm text-gray-500 mb-5">
          Home <span className="mx-2">/</span>
          Listings <span className="mx-2">/</span>
          {listing.category}
        </p>

        {/* TITLE */}

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

          {/* ACTION BUTTONS */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer"
            >
              <FaShareAlt />
              {shareMessage || "Share"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer"
            >
              <FaHeart className={isSaved ? "text-red-500" : "text-gray-400"} />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* MAIN IMAGE */}

        <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm group">
          {currentImage && (
            <img
              src={currentImage.url}
              alt={listing.title}
              className="w-full h-[300px] sm:h-[450px] lg:h-[550px] object-cover"
            />
          )}

          {/* PREVIOUS BUTTON */}

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handlePreviousImage}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* NEXT BUTTON */}

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition"
            >
              <FaChevronRight />
            </button>
          )}

          {/* IMAGE COUNTER */}

          {allImages.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
              {selectedImage + 1} / {allImages.length}
            </div>
          )}

          {/* FULLSCREEN BUTTON */}

          {allImages.length > 0 && (
            <button
              type="button"
              onClick={handleOpenLightbox}
              aria-label="Open full screen gallery"
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
            >
              <FaExpand />
              <span className="hidden sm:inline">View Photos</span>
            </button>
          )}
        </div>

        {/* THUMBNAIL GALLERY */}

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
                  onClick={() => handleGalleryImageClick(index)}
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

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-10">
            {/* PROPERTY INFORMATION */}

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

            {/* DESCRIPTION */}

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this property
              </h2>

              <p className="text-gray-600 leading-8 text-lg">
                {listing.description}
              </p>
            </section>

            {/* AMENITIES */}

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

            {/* HOST */}

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

            {/* REVIEWS */}

            <Reviews
              listingId={id}
              ownerId={listing.owner?._id}
              onChange={refreshListing}
            />
          </div>

          {/* BOOKING CARD */}

          <aside>
            <div className="lg:sticky lg:top-6 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              {/* PRICE */}

              <div className="flex items-baseline gap-2">
                <FaRupeeSign className="text-blue-600" />

                <span className="text-3xl font-bold text-gray-900">
                  {listing.price}
                </span>

                <span className="text-gray-500">/ night</span>
              </div>

              {/* RATING */}

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

              {/* DATES */}

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
                        min={today}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          setBookingError("");
                          if (checkOut && e.target.value >= checkOut) {
                            setCheckOut("");
                          }
                        }}
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
                        min={minCheckOut}
                        onChange={(e) => {
                          setCheckOut(e.target.value);
                          setBookingError("");
                        }}
                        className="w-full text-sm outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GUESTS */}

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

              {/* PRICE SUMMARY */}

              {nights > 0 && (
                <div className="border-t border-gray-200 mt-6 pt-5">
                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>
                      ₹{listing.price} × {nights} {nights === 1 ? "night" : "nights"}
                    </span>

                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>

                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* RESERVE */}

              {datesConflict && (
                <p className="mt-4 text-sm text-red-600">
                  These dates are already booked.
                </p>
              )}

              {bookingError && (
                <p className="mt-4 text-sm text-red-600">{bookingError}</p>
              )}

              {isOwner ? (
                <Link
                  to={`/edit-listing/${listing._id}`}
                  className="block text-center w-full mt-6 py-3.5 rounded-xl font-bold text-lg bg-gray-800 text-white hover:bg-gray-900 transition"
                >
                  This is your listing - Edit
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleReserve}
                  disabled={!listing.isAvailable || reserving || datesConflict}
                  className={`w-full mt-6 py-3.5 rounded-xl font-bold text-lg transition ${
                    listing.isAvailable && !datesConflict
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!listing.isAvailable
                    ? "Currently Unavailable"
                    : reserving
                      ? "Sending request..."
                      : "Reserve Now"}
                </button>
              )}

              {listing.isAvailable && !isOwner && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  You won't be charged yet. The host will confirm your request.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* LIGHTBOX */}

      {showLightbox && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* CLOSE */}

          <button
            type="button"
            onClick={handleCloseLightbox}
            aria-label="Close gallery"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* PREVIOUS */}

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

          {/* IMAGE */}

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

          {/* NEXT */}

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
