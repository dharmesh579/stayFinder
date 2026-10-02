import api from "./api";

export const createListing = async (formData) => {
  const response = await api.post("/listings", formData);
  return response.data;
};

export const getAllListings = async () => {
  const response = await api.get("/listings");
  return response.data;
};

export const getListingById = async (listingId) => {
  const response = await api.get(`/listings/${listingId}`);

  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get("/listings/my-listings");

  return response.data;
};

export const updateListing = async (listingId, data) => {
  const response = await api.put(`/listings/${listingId}`, data);

  return response.data;
};

export const deleteListing = async (listingId) => {
  const response = await api.delete(`/listings/${listingId}`);

  return response.data;
};
