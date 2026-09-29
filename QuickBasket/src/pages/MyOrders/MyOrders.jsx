import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const userOrders = user
      ? savedOrders.filter(
          (order) =>
            order.userId === user.id ||
            order.userId === user.email
        )
      : [];

    setOrders(userOrders);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          My Orders
        </h2>

        {/* User Not Logged In */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-5 rounded-lg">
            <p className="mb-3">
              Please login to view your orders.
            </p>

            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        )}

        {/* No Orders */}
        {user && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">📦</div>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h4>

            <p className="text-gray-500 mb-6">
              You have not placed any orders yet.
            </p>

            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >

              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-200">

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Ordered on: {order.date}
                  </p>
                </div>

                <span className="w-fit bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status || "Confirmed"}
                </span>

              </div>

              {/* Products */}
              <div className="p-5">

                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  >

                    <div>
                      <h4 className="font-medium text-gray-800">
                        {item.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-blue-600">
                    ₹{order.total}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyOrders;