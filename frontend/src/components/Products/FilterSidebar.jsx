import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    materials: [],
    brand: [],
    minPrice: 0,
    maxPrice: 1000,
  });

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Brown",
    "Pink",
    "Purple",
    "Orange",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Silk",
    "Linen",
    "Denim",
    "Leather",
    "Nylon",
    "Spandex",
    "Rayon",
    "Cashmere",
    "Bamboo",
  ];
  const brands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Uniqlo",
    "Gap",
    "Levi's",
    "Calvin Klein",
    "Tommy Hilfiger",
    "Ralph Lauren",
    "Gucci",
    "Prada",
  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      materials: params.materials ? params.materials.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 1000,
    });
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else if (type === "number") {
      newFilters[name] = parseInt(value) || 0;
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    const newFilters = { ...filters, maxPrice: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              id={`category-${category}`}
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4"
            />
            <label
              htmlFor={`category-${category}`}
              className="text-gray-700 cursor-pointer"
            >
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              id={`gender-${gender}`}
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4"
            />
            <label
              htmlFor={`gender-${gender}`}
              className="text-gray-700 cursor-pointer"
            >
              {gender}
            </label>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <select
          name="color"
          value={filters.color}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Color</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center text-sm text-gray-700"
            >
              <input
                type="checkbox"
                name="size"
                value={size}
                checked={filters.size.includes(size)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        <div className="max-h-40 overflow-y-auto">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center text-sm text-gray-700 mb-1"
            >
              <input
                type="checkbox"
                name="materials"
                value={material}
                checked={filters.materials.includes(material)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4"
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        <div className="max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center text-sm text-gray-700 mb-1"
            >
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={filters.brand.includes(brand)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.maxPrice}
          onChange={handleMaxPriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-sm text-gray-600 mt-2">
          Up to ${filters.maxPrice}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const resetFilters = {
            category: "",
            gender: "",
            color: "",
            size: [],
            materials: [],
            brand: [],
            minPrice: 0,
            maxPrice: 1000,
          };
          setFilters(resetFilters);
          setSearchParams({});
        }}
        className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
