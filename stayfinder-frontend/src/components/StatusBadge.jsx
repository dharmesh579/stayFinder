const STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STYLES[status] || STYLES.cancelled}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
