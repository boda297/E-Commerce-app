import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetails, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", text: "" });
  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ productId: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setSelectedImage(productDetails.images[0]);
    }
  }, [productDetails]);

  const handleQuantityChange = (action) => {
    if (action === "increment") setQuantity((prev) => prev + 1);
    if (action === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    console.log("Current user:", user); // Debug log

    if (!user) {
      toast.error("You must be logged in to add items to the cart.", {
        duration: 1200,
      });
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1200,
      });
      return;
    }

    // Check if user ID exists
    if (!user.id && !user._id) {
      toast.error("User ID not found. Please try logging in again.", {
        duration: 1200,
      });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        userId: user.id || user._id, // Try both possible ID field names
      })
    )
      .then(() => {
        toast.success("Product added to cart!", { duration: 1200 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // handle new comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) {
      toast.error("Please fill in both name and comment.");
      return;
    }
    const comment = {
      id: Date.now(),
      name: newComment.name,
      text: newComment.text,
      date: new Date().toLocaleString(),
    };
    setComments([comment, ...comments]); // add new comment at the top
    setNewComment({ name: "", text: "" }); // clear form
    toast.success("Comment added!");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!productDetails) return <div className="p-6">No product found</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-8 rounded-xl ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Images */}
          <div className="md:col-span-6 flex gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
              {productDetails.images?.map((image, index) => (
                <div
                  key={image._id || index}
                  onClick={() => setSelectedImage(image)}
                  className={`cursor-pointer border rounded-lg overflow-hidden ${
                    selectedImage?.url === image.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText}
                  className="h-[600px] object-cover"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-6">
            <h1 className="text-3xl font-bold mb-2">{productDetails.name}</h1>

            {/* Price */}
            {productDetails.discountPrice ? (
              <div className="flex items-center gap-3 mb-4">
                <span className="line-through text-gray-500 text-lg">
                  ${productDetails.price.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-black">
                  ${productDetails.discountPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-4">
                ${productDetails.price.toFixed(2)}
              </p>
            )}

            {/* Description */}
            <p className="text-gray-700 mb-6">{productDetails.description}</p>

            {/* Colors */}
            {productDetails.colors?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Choose Color:</p>
                <div className="flex gap-3">
                  {productDetails.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border ${
                        selectedColor === color
                          ? "ring-2 ring-black border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                      title={color}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {productDetails.sizes?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Choose Size:</p>
                <div className="flex flex-wrap gap-2">
                  {productDetails.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-2 px-4 ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity:</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-3 px-6 rounded-md w-full font-medium ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add to Cart"}
            </button>

            {/* Characteristics */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-3">Product Details</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                {productDetails.brand && (
                  <p>
                    <span className="font-medium">Brand:</span>{" "}
                    {productDetails.brand}
                  </p>
                )}
                {productDetails.material && (
                  <p>
                    <span className="font-medium">Material:</span>{" "}
                    {productDetails.material}
                  </p>
                )}
                {productDetails.category && (
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {productDetails.category}
                  </p>
                )}
                {productDetails.gender && (
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {productDetails.gender}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
            <textarea
              placeholder="Write your comment..."
              value={newComment.text}
              onChange={(e) =>
                setNewComment({ ...newComment, text: e.target.value })
              }
              className="w-full border rounded-md p-2 h-24"
            ></textarea>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900"
            >
              Submit Comment
            </button>
          </form>

          {/* List of Comments */}
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-gray-700">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-6">
              You May Also Like
            </h2>
            <ProductGrid products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
