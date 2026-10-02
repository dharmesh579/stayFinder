import api from "./api";

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const toggleWishlist = async (listingId) => {
  const response = await api.post(`/wishlist/${listingId}`);
  return response.data;
};
