import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product._id}`}
          className="group block transition-transform duration-200 "
        >
          <div className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 m-1">
            {/* Image Container */}
            <div className="relative w-full h-80 bg-gray-50 overflow-hidden">
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover  "
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
  );
};

export default ProductGrid;
