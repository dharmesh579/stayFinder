import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

function NotFound() {
  return (
    <main className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        {/* 404 */}

        <p className="text-8xl md:text-9xl font-black text-blue-600">404</p>

        {/* TITLE */}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h1>

        {/* DESCRIPTION */}

        <p className="text-gray-500 text-lg mt-4 leading-7">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {/* HOME */}

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <FaHome />
            Back to Home
          </Link>

          {/* GO BACK */}

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
