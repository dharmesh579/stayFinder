import Button from "./Button.jsx";
function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Find Your Perfect Stay
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Discover apartments,villas,hotels and PGs across india with ease
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button>Explore Properties</Button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              Become a host
            </button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D"
            alt="Luxury House"
            className="w-full max-w-lg rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
