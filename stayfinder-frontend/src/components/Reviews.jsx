import { useEffect, useState, useCallback } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getListingReviews,
  createReview,
  deleteReview,
} from "../services/reviewService";
import { useAuth } from "../context/useAuth";
import { formatDate } from "../utils/format";

function Stars({ value, onSelect }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onSelect ? "cursor-pointer" : "cursor-default"}
        >
          <FaStar className={n <= value ? "text-yellow-500" : "text-gray-300"} />
        </button>
      ))}
    </div>
  );
}

function Reviews({ listingId, ownerId, onChange }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      const res = await getListingReviews(listingId);
      setReviews(res.data);
    } catch {
      setError("Could not load reviews");
    }
  }, [listingId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const userId = user?._id || user?.id;
  const isOwner = userId && ownerId && userId === ownerId;
  const hasReviewed = reviews.some((r) => r.user?._id === userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createReview(listingId, { rating, comment });
      setComment("");
      setRating(5);
      await loadReviews();
      onChange?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await deleteReview(reviewId);
      await loadReviews();
      onChange?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete review");
    }
  };

  return (
    <section className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">
        Reviews ({reviews.length})
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!user && (
        <p className="text-gray-600 mb-6">
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>{" "}
          to write a review.
        </p>
      )}

      {user && !isOwner && !hasReviewed && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 shadow-sm mb-8 space-y-4"
        >
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your rating</p>
            <Stars value={rating} onSelect={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            minLength={5}
            maxLength={500}
            rows={3}
            placeholder="Share your experience (5-500 characters)"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Stars value={review.rating} />
                  {review.user?._id === userId && (
                    <button
                      type="button"
                      onClick={() => handleDelete(review._id)}
                      aria-label="Delete review"
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Reviews;
