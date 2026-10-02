import { useState } from "react";
import Button from "../components/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService.js";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) return setError("Passwords didn't match");
    setLoading(true);
    const userData = {
      fullName,
      email,
      password,
    };
    try {
      const data = await register(userData);
      setSuccess(`${data.message}. Redirecting to login...`);
      resetForm();

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <p className="text-center text-gray-500 mt-2">Join StayFinder today</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              name="fullName"
              id="fullName"
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Password Field */}

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                👁️
              </button>
            </div>
          </div>
          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                required
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirmPassword"
                id="confirmPassword"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                👁️
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}
          </div>
          {/* Create Button */}
          <Button disabled={loading} type="submit" className="w-full py-3">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{"  "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
