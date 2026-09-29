import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read from navigation state, or fallback to localStorage
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      try {
        const storedOrder = localStorage.getItem("quickbasket-order");
        if (storedOrder) {
          setOrder(JSON.parse(storedOrder));
        }
      } catch (err) {
        console.error("Error loading order:", err);
      }
    }
  }, [location.state]);

  const handleCopyOrderId = () => {
    if (!order?.orderId) return;
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPaymentId = () => {
    if (!order?.paymentId) return;
    navigator.clipboard.writeText(order.paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-gray-50">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl mb-4">
          🛍️
        </div>
        <h2 className="text-2xl font-bold text-gray-800">No Recent Order Found</h2>
        <p className="mt-2 text-gray-600 max-w-md">
          It looks like you haven't placed an order recently or your session has expired.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-green-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const isRazorpay =
    order.paymentMethod === "upi" ||
    order.paymentMethod === "card" ||
    order.paymentMethod?.toLowerCase().includes("razorpay");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-gray-50 to-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Header Card */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 text-center shadow-sm">
          {/* Animated checkmark icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 animate-bounce">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            {isRazorpay ? "Payment Confirmed via Razorpay (Test)" : "Order Placed Successfully"}
          </span>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Thank you for your order! 🎉
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Your fresh groceries are being packed and prepared for express delivery.
          </p>

          {/* Order Reference Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-left">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Order ID</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm sm:text-base font-bold text-gray-800">
                  {order.orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  title="Copy Order ID"
                  className="rounded px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Date & Time</p>
              <p className="mt-0.5 text-sm sm:text-base font-semibold text-gray-800">
                {formattedDate}
              </p>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Estimated Delivery</p>
              <p className="mt-0.5 text-sm sm:text-base font-semibold text-emerald-600 flex items-center gap-1">
                <span>⚡</span> In 25 - 35 mins
              </p>
            </div>
          </div>
        </div>

        {/* Razorpay Payment Information Card */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                💳
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Payment Details</h2>
                <p className="text-xs text-gray-500">
                  {isRazorpay
                    ? "Processed securely through Razorpay Test Gateway"
                    : "Pay at your doorstep upon order arrival"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                order.paymentStatus === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.paymentStatus === "Paid" ? "✓ Paid (Online)" : "Cash on Delivery"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
              <span className="text-xs text-gray-500 block">Payment Method</span>
              <span className="font-semibold text-gray-800 mt-1 block capitalize">
                {order.paymentMethod === "upi"
                  ? "UPI (Google Pay / PhonePe / Paytm)"
                  : order.paymentMethod === "card"
                  ? "Credit / Debit Card (Visa, MC, RuPay)"
                  : order.paymentMethod === "cod"
                  ? "Cash on Delivery (COD)"
                  : order.paymentMethod}
              </span>
            </div>

            {order.paymentId ? (
              <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100">
                <span className="text-xs text-emerald-700 block">Razorpay Payment ID (Test)</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-xs sm:text-sm text-emerald-900 break-all">
                    {order.paymentId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentId}
                    className="ml-2 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                <span className="text-xs text-gray-500 block">Payment Status</span>
                <span className="font-semibold text-gray-800 mt-1 block">
                  Pay ₹{order.total} in cash or UPI QR upon arrival
                </span>
              </div>
            )}
          </div>

          {isRazorpay && (
            <div className="mt-4 rounded-xl bg-blue-50/80 border border-blue-200/70 p-3 text-xs text-blue-800 flex items-start gap-2.5">
              <span className="text-base leading-none">🛡️</span>
              <div>
                <span className="font-semibold">Razorpay Test Gateway Verified:</span> This transaction was simulated in Razorpay sandbox mode. No real money was debited from your bank or card account.
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address Details Card */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📍</span> Delivery Address
          </h2>
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 text-base">
              {order.customer?.fullName}
            </p>
            <p className="mt-1 text-gray-600">
              📞 {order.customer?.phone}
            </p>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {order.customer?.address}
            </p>
            <p className="text-gray-700 font-medium">
              {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
            </p>
          </div>
        </div>

        {/* Items Summary Card */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛒</span> Ordered Items ({order.items?.length || 0})
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <div key={item.id || idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                      🥬
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  ₹{Number(item.price) * Number(item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal || order.total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total Amount</span>
              <span className="text-lg text-emerald-700">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 rounded-xl bg-green-600 py-3.5 text-center font-bold text-white shadow-sm hover:bg-green-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="flex-1 rounded-xl border border-gray-300 bg-white py-3.5 text-center font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
