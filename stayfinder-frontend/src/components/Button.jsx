function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
