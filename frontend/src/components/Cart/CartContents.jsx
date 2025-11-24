import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const CartContents = ({ cart, user }) => {
  const dispatch = useDispatch();

  // handle quantity change,
  const handleQuantityChange = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
        })
      );
    } else {
      toast.error("Quantity cannot be less than 1");
    }
  };

  // handle remove item from cart
  const handleRemoveItem = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }));
  };

  const subtotal = cart.totalAmount;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const navigate = useNavigate();

  const handleCheckOut = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  if (cart.products?.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/collections/all">
          <button className="mt-4 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 cursor-pointer">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-2">
        {cart.items?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <button
                    onClick={() =>
                      handleRemoveItem(item.product, item.size, item.color)
                    }
                    className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>Size: {item.size}</span>
                  <span>Color: {item.color}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product,
                          -1,
                          item.quantity,
                          item.size,
                          item.color
                        )
                      }
                      className="cursor-pointer w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm font-medium">-</span>
                    </button>
                    <span className="font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product,
                          1,
                          item.quantity,
                          item.size,
                          item.color
                        )
                      }
                      className="cursor-pointer w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm font-medium">+</span>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${shipping?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax?.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckOut}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 mb-4 cursor-pointer"
          >
            Proceed to Checkout
          </button>

          <Link to="/collections/all">
            <button className="w-full text-gray-600 py-3 rounded-xl border border-gray-300 font-medium hover:border-gray-400 transition-colors duration-300 cursor-pointer">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartContents;
