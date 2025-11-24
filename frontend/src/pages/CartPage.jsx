import React, { useEffect } from "react";
import CartContents from "../components/Cart/CartContents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { fetchCart } from "../redux/slices/cartSlice"; // Import your fetchCart action

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart, loading, error } = useSelector((state) => state.cart);
  console.log(`User: `, user);
  console.log(`Cart: `, cart);

  useEffect(() => {
    // Check if user is signed in
    if (!user) {
      toast.error("Please log in to access your cart");
      navigate("/login");
      return; // Stop execution if not logged in
    }

    // User is signed in - fetch their cart
    dispatch(fetchCart());
  }, [user, dispatch, navigate]);

  // Show error if cart fetch failed
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load cart");
    }
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                1
              </span>
              <span className="font-medium text-gray-900">Cart</span>
              <span className="text-gray-300">→</span>
              <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                2
              </span>
              <span>Checkout</span>
              <span className="text-gray-300">→</span>
              <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                3
              </span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!cart || cart?.items?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mt-2">
            Browse our products and add items to your cart
          </p>
          <Link
            to="/collections/all"
            className="mt-6 inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CartContents cart={cart} user={user} />
        </div>
      )}

      {/* Security & Trust Badges */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Checkout
              </h3>
              <p className="text-gray-600 text-sm">
                Your payment information is encrypted and secure
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm">
                On orders over $50 within the US
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">
                30-day return policy on all items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
