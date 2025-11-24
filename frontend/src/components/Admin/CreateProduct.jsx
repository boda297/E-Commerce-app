import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import axios from "axios";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [productData, setProductData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file); // <-- FIXED: match backend field name

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/product-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.data.imageUrl, altText: "" }], // <-- FIXED: correct response shape
      }));
      setUploading(false);
    } catch (error) {
      setUploading(false);
      alert(
        "Error uploading image: " +
          (error?.response?.data?.message || error.message || "Unknown error")
      ); // Add user notification
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createProduct(productData));
      // Check for error or fulfilled
      if (createProduct.fulfilled.match(resultAction)) {
        alert("Product created successfully!");
        console.log("Create success:", resultAction.payload);
        navigate("/admin/products");
      } else {
        // If rejected, show error
        alert(
          "Product creation failed: " +
            (resultAction?.payload?.message ||
              resultAction?.error?.message ||
              "Unknown error")
        );
        console.error("Create error:", resultAction);
      }
    } catch (err) {
      alert("Something went wrong: " + (err.message || err));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleRemoveImage = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Edit Product" : "Create Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block font-semibold mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>
        {/* price */}
        <div className="mb-6">
          <label htmlFor="price" className="block font-semibold mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Count in stock */}
        <div className="mb-6">
          <label htmlFor="countInStock" className="block font-semibold mb-2">
            Count in Stock
          </label>
          <input
            type="number"
            name="countInStock"
            id="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* SKU */}
        <div className="mb-6">
          <label htmlFor="sku" className="block font-semibold mb-2">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            id="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Brand */}
        <div className="mb-6">
          <label htmlFor="brand" className="block font-semibold mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            id="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Collections */}
        <div className="mb-6">
          <label htmlFor="collections" className="block font-semibold mb-2">
            Collection
          </label>
          <input
            type="text"
            name="collections"
            id="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block font-semibold mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Material */}
        <div className="mb-6">
          <label htmlFor="material" className="block font-semibold mb-2">
            Material
          </label>
          <input
            type="text"
            name="material"
            id="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Gender */}
        <div className="mb-6">
          <label htmlFor="gender" className="block font-semibold mb-2">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Gender</option>
            <option value="Men">Male</option>
            <option value="Women">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        {/* Sizes */}
        <div className="mb-6">
          <label htmlFor="sizes" className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            id="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* colors */}
        <div className="mb-6">
          <label htmlFor="colors" className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            id="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* image upload */}
        <div className="mb-6">
          <label htmlFor="image" className="block font-semibold mb-2">
            Upload Images
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            disabled={uploading}
            accept="image/*"
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt="Product image"
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
          disabled={loading || uploading}
        >
          {id ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
