import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  console.log("Orders from state:", orders);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-200 text-green-900";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchUserOrders())}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You have no orders yet</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-sm uppercase text-gray-700">
              <tr>
                <th className="py-2 px-4 sm:py-3">Image</th>
                <th className="py-2 px-4 sm:py-3">Order ID</th>
                <th className="py-2 px-4 sm:py-3">Created</th>
                <th className="py-2 px-4 sm:py-3">Shipping Address</th>
                <th className="py-2 px-4 sm:py-3">Items</th>
                <th className="py-2 px-4 sm:py-3">Total</th>
                <th className="py-2 px-4 sm:py-3">Payment</th>
                <th className="py-2 px-4 sm:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <img
                        src={order.orderItems[0].image || "/placeholder.jpg"}
                        alt={order.orderItems[0].name || "Product"}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-sm font-medium text-gray-900">
                    <span className="block truncate max-w-[100px]">
                      #{order._id.slice(-8)}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-sm">
                    <div className="flex flex-col">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-sm text-gray-700">
                    {order.shippingAddress?.city || "N/A"},{" "}
                    {order.shippingAddress?.country || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-sm text-gray-700">
                    {order.orderItems?.length || 0} item(s)
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-sm font-medium text-gray-900">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
