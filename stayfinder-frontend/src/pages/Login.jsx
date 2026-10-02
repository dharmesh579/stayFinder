import Button from "../components/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/authService.js";
import { useAuth } from "../context/useAuth.js";
function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  function resetForm() {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const userData = {
      email,
      password,
    };
    try {
      const data = await login(userData);
      setSuccess(`${data.message}.Redirecting to Home...`);
      resetForm();
      setUser(data.data);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Something Went Wrong",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-gray-500 text-center mt-2">
          Login to your StayFinder account
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
