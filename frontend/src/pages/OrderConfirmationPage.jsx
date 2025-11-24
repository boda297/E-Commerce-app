import React from "react";

const checkout = {
  _id: "12345",
  createdAt: new Date(),
  checkoutItems: [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      size: "M",
      color: "Red",
      quantity: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAT3QWGaKoZL8QNnPLGdZX-NVSA1IbUCKqvQ&s",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      size: "L",
      color: "Blue",
      quantity: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAT3QWGaKoZL8QNnPLGdZX-NVSA1IbUCKqvQ&s",
    },
    {
      id: 3,
      name: "Product 3",
      price: 39.99,
      size: "S",
      color: "Green",
      quantity: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAT3QWGaKoZL8QNnPLGdZX-NVSA1IbUCKqvQ&s",
    },
  ],
  shippingAddress: {
    address: "1234 street",
    city: "cairo",
    country: "Eygpt",
  },
};

const OrderConfirmationPage = () => {
  const calculatedEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order ID and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculatedEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* ordered Items */}
          <div className="mb-20">
            {checkout.checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold ">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">${item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">Paypal</p>
            </div>
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
