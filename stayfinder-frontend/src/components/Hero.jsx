import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-house.jpg";

function Hero() {
  const navigate = useNavigate();

  const scrollToListings = () => {
    document
      .getElementById("listings")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[560px] flex items-center">
      {/* Background image + dark overlay */}
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-36 w-full">
        <span className="inline-block bg-white/15 backdrop-blur text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/30">
          Apartments · Villas · Hotels · Farmhouses
        </span>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
          Find a place that feels like <span className="text-blue-400">home</span>,
          wherever you go
        </h1>

        <p className="mt-5 text-lg text-gray-200 max-w-xl">
          Discover and book stays across India, or become a host and start
          earning from your own property.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={scrollToListings}
            className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Explore Properties
          </button>
          <button
            onClick={() => navigate("/create-listing")}
            className="border border-white text-white px-7 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition cursor-pointer"
          >
            Become a Host
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
