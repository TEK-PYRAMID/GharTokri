import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  initiateRazorpayPayment,
  getRazorpayKey,
  saveRazorpayKey,
} from "../../services/razorpayService";

const Checkout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const cart = useCart();
  const cartItems = cart?.cartItems || [];
  const clearCart = cart?.clearCart;

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Payment method: "cod" | "upi" | "card"
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKey, setCustomKey] = useState(getRazorpayKey());
  const [keySavedMessage, setKeySavedMessage] = useState("");

  // Update fullName/phone if user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // -----------------------------
  // Calculate cart totals
  // -----------------------------
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const deliveryCharge = 0;
  const discount = 0;
  const total = subtotal + deliveryCharge - discount;

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // -----------------------------
  // Validate form
  // -----------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number (starts with 6-9)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Finalize order & redirect
  // -----------------------------
  const finalizeOrder = (orderData) => {
    // 1. Save single recent order for instant receipt
    localStorage.setItem("quickbasket-order", JSON.stringify(orderData));

    // 2. Persist to order history list
    try {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const orderHistoryItem = {
        id: orderData.orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: orderData.paymentStatus === "Paid" ? "Confirmed (Paid)" : "Confirmed (COD)",
        total: orderData.total,
        items: orderData.items,
        userId: user ? user.id || user.email : "guest",
        paymentMethod: orderData.paymentMethod,
        paymentId: orderData.paymentId || null,
        customer: orderData.customer,
      };
      existingOrders.unshift(orderHistoryItem);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
    } catch (err) {
      console.error("Error saving orders array:", err);
    }

    // 3. Clear cart
    if (clearCart) {
      clearCart();
    }

    // 4. Navigate to confirmation page
    navigate("/order-confirmation", {
      state: {
        order: orderData,
      },
    });
  };

  // -----------------------------
  // Place order handler
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setPaymentError("");
    const generatedOrderId = `QB-${Date.now()}`;

    // 1. Cash on Delivery
    if (paymentMethod === "cod") {
      const order = {
        orderId: generatedOrderId,
        customer: {
          ...formData,
          email: user?.email || "customer@quickbasket.com",
        },
        items: cartItems,
        subtotal,
        deliveryCharge,
        discount,
        total,
        paymentMethod: "cod",
        paymentStatus: "Pending (COD)",
        status: "Order Placed",
        createdAt: new Date().toISOString(),
      };
      finalizeOrder(order);
      return;
    }

    // 2. Online Razorpay Payment (UPI or Credit/Debit Card)
    setIsProcessing(true);

    try {
      await initiateRazorpayPayment({
        amount: total,
        paymentMethod,
        customer: {
          ...formData,
          email: user?.email || "customer@quickbasket.com",
        },
        orderId: generatedOrderId,
        onSuccess: (paymentResult) => {
          setIsProcessing(false);
          const order = {
            orderId: generatedOrderId,
            customer: {
              ...formData,
              email: user?.email || "customer@quickbasket.com",
            },
            items: cartItems,
            subtotal,
            deliveryCharge,
            discount,
            total,
            paymentMethod,
            paymentStatus: "Paid",
            paymentId: paymentResult.razorpay_payment_id,
            status: "Order Confirmed",
            createdAt: new Date().toISOString(),
          };
          finalizeOrder(order);
        },
        onError: (err) => {
          setIsProcessing(false);
          console.warn("Razorpay Checkout Error:", err);
          const message =
            typeof err === "string"
              ? err
              : err?.description || err?.message || "Payment process could not be completed.";
          setPaymentError(message);
        },
        onDismiss: () => {
          setIsProcessing(false);
          setPaymentError(
            "Razorpay payment window was dismissed. You can retry or choose another payment method."
          );
        },
      });
    } catch (err) {
      setIsProcessing(false);
      console.error("Unexpected checkout error:", err);
      setPaymentError(err.message || "Failed to initialize payment gateway.");
    }
  };

  // Instant simulator fallback for testing environment
  const handleSimulatePayment = () => {
    if (!validateForm()) return;
    setIsProcessing(false);
    const generatedOrderId = `QB-${Date.now()}`;
    const simulatedPaymentId = `pay_test_${Math.random().toString(36).substring(2, 11)}`;

    const order = {
      orderId: generatedOrderId,
      customer: {
        ...formData,
        email: user?.email || "customer@quickbasket.com",
      },
      items: cartItems,
      subtotal,
      deliveryCharge,
      discount,
      total,
      paymentMethod,
      paymentStatus: "Paid",
      paymentId: simulatedPaymentId,
      status: "Order Confirmed",
      createdAt: new Date().toISOString(),
    };
    finalizeOrder(order);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    saveRazorpayKey(customKey);
    setKeySavedMessage("Key updated successfully!");
    setTimeout(() => setKeySavedMessage(""), 2500);
  };

  // -----------------------------
  // Empty cart fallback
  // -----------------------------
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-gray-500">
          Add some fresh grocery products before checkout.
        </p>
        <Link
          to="/products"
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // -----------------------------
  // Checkout UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete your delivery details and choose your preferred payment method.
              </p>
            </div>
            {/* Razorpay Test Mode Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Razorpay Gateway (Test Mode Active)
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {paymentError && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-sm">Payment Notice</h4>
                  <p className="text-xs text-amber-800 mt-0.5">{paymentError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  Simulate Test Success
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentError("")}
                  className="rounded-lg border border-amber-300 px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =====================================
              LEFT SIDE: Delivery & Payment
          ====================================== */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>📍</span> Delivery Information
                </h2>
                <span className="text-xs text-gray-400 font-medium">* Required</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                      errors.fullName
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number (10 digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="9876543210"
                      className={`w-full rounded-lg border pl-11 pr-3 py-2.5 text-sm outline-none transition ${
                        errors.phone
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pincode (6 digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="560001"
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                      errors.pincode
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Flat/House no, Apartment/Building, Street, Landmark..."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                      errors.address
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bengaluru, Mumbai, etc."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                      errors.city
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Karnataka, Maharashtra, etc."
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                      errors.state
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
            </section>

            {/* =====================================
                PAYMENT METHODS
            ====================================== */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>💳</span> Payment Method
                </h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  100% Secure Checkout
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Tap on <strong>UPI</strong> or <strong>Credit / Debit Card</strong> to pay via Razorpay testing gateway.
              </p>

              <div className="mt-5 space-y-3.5">
                {/* 1. UPI Radio Option */}
                <label
                  className={`flex cursor-pointer flex-col rounded-xl border p-4 transition ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaymentError("");
                      }}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚡</span>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            UPI (Google Pay, PhonePe, Paytm, BHIM)
                          </span>
                        </div>
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                          Razorpay Test
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Instant, zero-fee payment using any UPI app or UPI ID.
                      </p>
                    </div>
                  </div>

                  {/* Expanded UPI Details when selected */}
                  {paymentMethod === "upi" && (
                    <div className="mt-3.5 pt-3 border-t border-emerald-200/60 pl-8 space-y-2 text-xs text-gray-600 animate-fadeIn">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          Google Pay
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          PhonePe
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          Paytm
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          BHIM / Any UPI ID
                        </span>
                      </div>
                      <div className="rounded-lg bg-emerald-100/60 p-2.5 text-emerald-900 border border-emerald-200">
                        <p className="font-semibold flex items-center gap-1">
                          <span>🧪</span> Testing Instruction:
                        </p>
                        <p className="mt-0.5">
                          When the Razorpay modal opens, select UPI and enter any test VPA like{" "}
                          <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-emerald-800">
                            success@razorpay
                          </code>{" "}
                          or simulate test success directly!
                        </p>
                      </div>
                    </div>
                  )}
                </label>

                {/* 2. Credit / Debit Card Radio Option */}
                <label
                  className={`flex cursor-pointer flex-col rounded-xl border p-4 transition ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaymentError("");
                      }}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💳</span>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            Credit / Debit Card
                          </span>
                        </div>
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                          Razorpay Test
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Visa, MasterCard, RuPay, Maestro & American Express.
                      </p>
                    </div>
                  </div>

                  {/* Expanded Card Details when selected */}
                  {paymentMethod === "card" && (
                    <div className="mt-3.5 pt-3 border-t border-emerald-200/60 pl-8 space-y-2 text-xs text-gray-600 animate-fadeIn">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          Visa
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          MasterCard
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          RuPay
                        </span>
                        <span className="rounded bg-white px-2 py-1 border border-gray-200 font-semibold text-gray-700 text-[11px]">
                          Maestro
                        </span>
                      </div>
                      <div className="rounded-lg bg-emerald-100/60 p-2.5 text-emerald-900 border border-emerald-200">
                        <p className="font-semibold flex items-center gap-1">
                          <span>🧪</span> Testing Instruction:
                        </p>
                        <p className="mt-0.5">
                          Use test card:{" "}
                          <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-emerald-800">
                            4111 1111 1111 1111
                          </code>
                          , any future expiry (e.g.{" "}
                          <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-emerald-800">
                            12/28
                          </code>
                          ), CVV:{" "}
                          <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-emerald-800">
                            123
                          </code>
                          , and any OTP.
                        </p>
                      </div>
                    </div>
                  )}
                </label>

                {/* 3. Cash on Delivery Radio Option */}
                <label
                  className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError("");
                    }}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💵</span>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Pay cash or scan QR when your groceries arrive at your doorstep.
                    </p>
                  </div>
                </label>
              </div>

              {/* Razorpay Test Settings Strip */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>⚙️</span>
                    <span>
                      Razorpay Key:{" "}
                      <code className="font-mono text-gray-800 font-semibold">
                        {customKey.substring(0, 12)}...
                      </code>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKeyConfig(!showKeyConfig)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    {showKeyConfig ? "Hide Config" : "Change Test Key"}
                  </button>
                </div>

                {showKeyConfig && (
                  <form onSubmit={handleSaveKey} className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Custom Razorpay Test Key ID:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        placeholder="rzp_test_..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono outline-none focus:border-green-500"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-green-600 px-3 py-1.5 font-bold text-white hover:bg-green-700 text-xs"
                      >
                        Save
                      </button>
                    </div>
                    {keySavedMessage && (
                      <p className="text-xs text-green-600 font-semibold">{keySavedMessage}</p>
                    )}
                  </form>
                )}
              </div>
            </section>
          </div>

          {/* =====================================
              RIGHT SIDE: Order Summary & Place Order
          ====================================== */}
          <div>
            <section className="sticky top-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              {/* Items List Preview */}
              <div className="mt-4 max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover border border-gray-100"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Total Amount */}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-lg text-emerald-700">₹{total}</span>
              </div>

              {/* Payment Method Badge */}
              <div className="mt-3 rounded-lg bg-gray-50 p-2 text-center text-xs text-gray-600 border border-gray-100">
                Paying via:{" "}
                <span className="font-bold text-gray-800 uppercase">
                  {paymentMethod === "upi"
                    ? "UPI (Razorpay)"
                    : paymentMethod === "card"
                    ? "Card (Razorpay)"
                    : "Cash on Delivery"}
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm sm:text-base font-bold text-white shadow-sm transition ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : paymentMethod === "cod"
                    ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99]"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Launching Razorpay...</span>
                  </>
                ) : paymentMethod === "cod" ? (
                  <span>Place Order (Cash on Delivery) • ₹{total}</span>
                ) : paymentMethod === "upi" ? (
                  <>
                    <span>⚡ Pay ₹{total} via Razorpay (UPI)</span>
                  </>
                ) : (
                  <>
                    <span>💳 Pay ₹{total} via Razorpay (Card)</span>
                  </>
                )}
              </button>

              {/* Instant Test Simulator Quick Button */}
              {(paymentMethod === "upi" || paymentMethod === "card") && (
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="mt-2.5 w-full rounded-lg border border-dashed border-emerald-300 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                >
                  ⚡ Fast-Track: Simulate Razorpay Test Payment
                </button>
              )}

              <Link
                to="/cart"
                className="mt-3 block w-full rounded-lg border border-gray-200 py-2.5 text-center text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                ← Back to Cart
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;