import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { FaEyeSlash, FaLock, FaEye, FaArrowLeft } from "react-icons/fa";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword({
        token,
        password,
      });
      setSuccess(data.message);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong.Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex justify-center items-center">
            <FaLock className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mt-5 text-gray-800">
            Reset Password
          </h1>
          <p className="text-gray-500 mt-2">Enter your new password below.</p>
        </div>
        <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="newpassword"
              className="block mb-2 font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newpassword"
                placeholder="Enter new password"
                id="newpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmpassword"
              className="block mb-2 font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                id="confirmpassword"
                placeholder="Confirm new password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/* success */}
          {success && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <h3 className="text-green-700 font-semibold">
                ✅ Password Reset Successful
              </h3>
              <p className="text-green-600 text-sm mt-2">{success}</p>
              <p className="text-green-600 text-sm mt-2">
                Redirecting to login...
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
          >
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
