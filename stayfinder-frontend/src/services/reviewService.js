import api from "./api";

export const getListingReviews = async (listingId) => {
  const response = await api.get(`/reviews/listing/${listingId}`);

  return response.data;
};

export const createReview = async (listingId, reviewData) => {
  const response = await api.post(`/reviews/listing/${listingId}`, reviewData);

  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};
