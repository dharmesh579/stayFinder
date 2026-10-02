import api from "./api";

export const createBooking = async (listingId, bookingData) => {
  const response = await api.post(`/bookings/listing/${listingId}`, bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getHostBookings = async () => {
  const response = await api.get("/bookings/host");
  return response.data;
};

export const getBookedDates = async (listingId) => {
  const response = await api.get(`/bookings/listing/${listingId}/booked-dates`);
  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};
