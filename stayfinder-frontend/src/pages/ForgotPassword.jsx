import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await forgotPassword({ email });
      setSuccess(data.message);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong.please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Heading */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <FaEnvelope className="text-3xl text-blue-600" />
            </div>*

            <h1 className="text-3xl font-bold mt-5 text-gray-800">
              Forgot Password
            </h1>
            <p className="text-gray-500 mt-2">
              Enter your registered email address and we'll send you a password
              reset link
            </p>
          </div>
          <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                required
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {success && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                <h3 className="text-green-700 font-semibold">
                  📧 Reset Link Sent!
                </h3>

                <p className="text-green-600 text-sm mt-2">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-5 py-3 rounded-lg text-white font-semibold transition ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
    </>
  );
}

export default ForgotPassword;
