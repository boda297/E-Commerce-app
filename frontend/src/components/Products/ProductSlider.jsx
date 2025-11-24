import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductSlider = ({ products, title, path }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -350 : 350;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      // Check initial state
      checkScrollButtons();

      // Recheck when window resizes
      const handleResize = () => checkScrollButtons();
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [products]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto mb-10 relative flex items-center justify-between">
        {/* Title */}
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* Scroll Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border bg-white text-black transition-all ${
              !canScrollLeft
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
            aria-label="Scroll left"
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border bg-white text-black transition-all ${
              !canScrollRight
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
            aria-label="Scroll right"
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex gap-2 sm:gap-6 relative select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUpOrLeave}
        onTouchMove={handleTouchMove}
      >
        {products &&
          products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product._id}`}
              className="group block transition-transform duration-200 min-w-[50%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%]"
            >
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative w-full h-80 bg-gray-50 overflow-hidden">
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    className="w-full h-full object-cover transition-transform duration-500"
                    draggable="false"
                    loading="lazy"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-gray-900 font-medium text-base mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-gray-900 font-semibold text-lg">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Show More Button */}
      <div className="container mx-auto mt-8 text-center">
        <Link
          to={path}
          className="inline-block px-8 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Show More
        </Link>
      </div>
    </section>
  );
};

export default ProductSlider;
