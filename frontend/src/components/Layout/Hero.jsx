import heroImg from "../../assets/rabbit-hero.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Hero Section"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter mb-4 text-white drop-shadow-lg">
            Discover Your Style
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6 text-white drop-shadow-lg">
            Discover the latest trends and exclusive offers
          </p>
          <Link
            to="/collections/all"
            className="bg-white/80 backdrop-blur-sm text-black px-6 py-3 rounded-lg hover:bg-white/90 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
