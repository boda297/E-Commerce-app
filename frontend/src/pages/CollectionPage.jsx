import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Build query params object
    const queryParams = {};

    // Get all parameters - if they're already comma-separated, keep them as is
    const allParams = [
      "size",
      "color",
      "material",
      "brand",
      "gender",
      "category",
      "minPrice",
      "maxPrice",
      "sortBy",
      "search",
      "limit",
    ];

    allParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        queryParams[param] = value;
      }
    });

    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [collection, searchParams, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // close the sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    // clean event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>
      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-84 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        {/* Sort Options */}
        <SortOptions />

        {/* Product Grid */}
        {!loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center">
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-2 text-gray-500">
                No products match your current filters. Try adjusting your
                selection.
              </p>
              <button
                onClick={() =>
                  (window.location.href = `/collections/${collection || "all"}`)
                }
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
