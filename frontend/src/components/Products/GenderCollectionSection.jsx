import { Link } from "react-router-dom";
import mensCollectionimg from "../../assets/mens-collection.webp";
import womensCollectionimg from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0 ">
      <div className="container mx-auto flex flex-col md:flex-row gap-8 ">
        {/* Women's Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionimg}
            alt="Women's Collection"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-center text-black">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-t">
                Women's Collection
              </h2>
              <Link
                to="/collections/all?gender=Women"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        {/* Men's Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionimg}
            alt="Men's Collection"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-center text-black">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-t">
                Men's Collection
              </h2>
              <Link
                to="/collections/all?gender=Men"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
