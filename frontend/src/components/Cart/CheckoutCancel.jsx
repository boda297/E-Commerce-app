// CheckoutCancel.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            Your items are still in your cart. You can complete your purchase whenever you're ready.
          </p>
          {checkoutId && (
            <p className="text-sm text-gray-600 mt-2">
              Checkout ID: {checkoutId}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Return to Cart
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-3">
            If you encountered any issues during checkout, please contact our support team.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="text-black underline hover:text-gray-700"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;

