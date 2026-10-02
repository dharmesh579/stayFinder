import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../services/authService";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const isLoggedIn = !!user;
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-blue-600">
          StayFinder
        </NavLink>

        <div className="hidden md:flex gap-6">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/my-listings" className={navLinkStyle}>
                MyListings
              </NavLink>
              <NavLink to="/create-listing" className={navLinkStyle}>
                Create Listing
              </NavLink>
              <NavLink to="/my-bookings" className={navLinkStyle}>
                My Bookings
              </NavLink>
              <NavLink to="/booking-requests" className={navLinkStyle}>
                Requests
              </NavLink>
              <NavLink to="/wishlist" className={navLinkStyle}>
                Wishlist
              </NavLink>
            </>
          )}
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={navLinkStyle}>
                Profile
              </NavLink>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkStyle}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
        <button
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "❌" : "Menu"}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 border-t bg-white">
          <NavLink
            to="/"
            className={navLinkStyle}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink
                to="/my-listings"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                My Listings
              </NavLink>
              <NavLink
                to="/create-listing"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                Create Listings
              </NavLink>
              <NavLink
                to="/my-bookings"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/booking-requests"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                Booking Requests
              </NavLink>
              <NavLink
                to="/wishlist"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </NavLink>
              <NavLink
                to="/profile"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
