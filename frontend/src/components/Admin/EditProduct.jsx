import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import axios from "axios";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [productData, setProductData] = useState({
    name: "",
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
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

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
      const resultAction = await dispatch(updateProduct({ id, productData }));
      // Check for error or fulfilled
      if (updateProduct.fulfilled.match(resultAction)) {
        alert("Product updated successfully!");
        console.log("Update success:", resultAction.payload);
        navigate("/admin/products");
      } else {
        // If rejected, show error
        alert(
          "Product update failed: " +
            (resultAction?.payload?.message ||
              resultAction?.error?.message ||
              "Unknown error")
        );
        console.error("Update error:", resultAction);
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

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form>
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
            Upload Image
          </label>
          <input type="file" onChange={handleImageUpload} />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt="Product image"
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          onClick={handleSubmit}
        >
          Edit Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
