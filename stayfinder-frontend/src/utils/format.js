export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;
