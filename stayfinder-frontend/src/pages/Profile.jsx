import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import {
  FaEnvelope,
  FaUserShield,
  FaHome,
  FaPlusCircle,
  FaLock,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import { logout, resendVerification } from "../services/authService.js";

function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  const handleResendVerification = async () => {
    try {
      const data = await resendVerification();
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        {/* Avatar */}
        <div className="flex justify-center">
          <img
            src={
              user.avatar ||
              "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
          />
        </div>

        {/* Name */}
        <h2 className="text-3xl font-bold text-center mt-6">{user.fullName}</h2>

        {/* Email */}
        <p className="flex justify-center items-center gap-2 text-gray-500 mt-3">
          <FaEnvelope className="text-blue-600" />
          {user.email}
        </p>

        {/* Role */}
        <div className="flex justify-center mt-4">
          <span className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
            <FaUserShield />
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        {/* Email Verification */}
        <div className="mt-6">
          {user.isEmailVerified ? (
            <div className="flex justify-center items-center gap-2 bg-green-100 text-green-700 py-3 rounded-lg">
              <FaCheckCircle />
              <span className="font-medium">Email Verified</span>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
              <div className="flex justify-center items-center gap-2 text-yellow-700 font-semibold">
                <FaExclamationTriangle />
                Email Not Verified
              </div>

              <p className="text-sm text-yellow-700 mt-2">
                Please verify your email to access all features.
              </p>

              <button
                onClick={handleResendVerification}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h3>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/my-listings")}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            <FaHome />
            My Listings
          </button>

          <button
            onClick={() => navigate("/create-listing")}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition"
          >
            <FaPlusCircle />
            Create Listing
          </button>

          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg transition"
          >
            <FaLock />
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
