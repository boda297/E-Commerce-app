import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckoutSession } from "../../redux/slices/checkoutSlice";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    checkout,
    loading: checkoutLoading,
    error: checkoutError,
  } = useSelector((state) => state.checkout);

  // Clear cart when checkout is successful
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
    }
  }, [checkout, dispatch]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const subtotal = cart.totalAmount || 0;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Redirect to Stripe URL directly when checkout session is created
  useEffect(() => {
    if (checkout && checkout.url) {
      console.log("Redirecting to Stripe URL:", checkout.url);
      window.location.href = checkout.url;
    }
  }, [checkout]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate user email exists
    if (!user || !user.email) {
      setSubmitError("User email is required. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Map cart items to checkout items format
      const checkoutItems = cart.items.map((item) => ({
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        productId: item.product || item._id,
      }));

      const checkoutData = {
        username: user.username,
        checkoutItems,
        shippingAddress: {
          address: `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.address}`,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        totalPrice: total,
        customerEmail: user.email,
      };

      console.log("Checkout data being sent:", checkoutData);

      // Dispatch the action to create checkout session
      await dispatch(createCheckoutSession(checkoutData)).unwrap();

      // The useEffect above will handle the redirect to Stripe
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage =
        err?.message ||
        err?.error ||
        JSON.stringify(err) ||
        "Failed to create checkout session";
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Helper function to format error messages
  const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return "An error occurred";
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">CheckOut</h2>

        {(submitError || checkoutError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {getErrorMessage(submitError || checkoutError)}
          </div>
        )}

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact details</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
              id="email"
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting || checkoutLoading}
              className="w-full bg-black text-white py-3 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting || checkoutLoading
                ? "Processing..."
                : "Continue to Payment"}
            </button>
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className=" mb-4">
            {cart.items?.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-md">{product.name}</h3>
                    <p className="text-gray-500">Size: {product.size}</p>
                    <p className="text-gray-500">Color: {product.color}</p>
                    <p className="text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-xl">${product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
