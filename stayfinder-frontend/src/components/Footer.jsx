import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              <FaHome className="inline mr-2" />
              StayFinder
            </h2>
            <p className="mt-3 text-gray-400">
              Find your perfect stay,
              <br />
              anywhere,anytime
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400 transition duration-300 cursor-pointer"
              >
                Home
              </Link>
              <Link
                to="/my-listings"
                className="text-gray-400 hover:text-blue-400 transition duration-300 cursor-pointer"
              >
                My Listings
              </Link>
              <Link
                to="/my-listings"
                className="text-gray-400 hover:text-blue-400 transition duration-300 cursor-pointer"
              >
                Create Listing
              </Link>
            </div>
          </div>

          {/* Conatct */}
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="mt-3 space-y-3 text-gray-400">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt />
                Andhra pradesh,India
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope />
                support@stayfinder.com
              </p>
              <p className="flex items-center gap-2">
                <FaPhone />
                +91 9876543210
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2026 StayFinder. All rights reserved.
            </p>

            <div className="flex gap-5 mt-4 md:mt-0 text-2xl">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 duration-300 hover:scale-110 transition"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300 hover:scale-110"
              >
                <FaLinkedin />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition duration-300 hover:scale-110"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
