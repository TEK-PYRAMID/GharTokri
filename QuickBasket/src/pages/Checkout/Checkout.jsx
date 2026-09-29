import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [errors, setErrors] = useState({});

  // -----------------------------
  // Calculate cart totals
  // -----------------------------

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
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
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Place order
  // -----------------------------

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    const order = {
      orderId: `QB-${Date.now()}`,

      customer: {
        ...formData,
      },

      items: cartItems,

      subtotal,
      deliveryCharge,
      discount,
      total,

      paymentMethod,

      status: "Order Placed",

      createdAt: new Date().toISOString(),
    };

    // Save order temporarily
    localStorage.setItem(
      "quickbasket-order",
      JSON.stringify(order)
    );

    // Go to order success page
    navigate("/order-success", {
      state: {
        order,
      },
    });
  };

  // -----------------------------
  // Empty cart
  // -----------------------------

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">

        <div className="text-7xl">
          🛒
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-2 text-gray-500">
          Add some products before checkout.
        </p>

        <Link
          to="/categories"
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Continue Shopping
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

          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Complete your delivery and payment details.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =====================================
              LEFT SIDE
          ====================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* Delivery Information */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Full Name */}

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}

                </div>

                {/* Phone */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* Pincode */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="6-digit pincode"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.pincode}
                    </p>
                  )}

                </div>

                {/* Address */}

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="House number, street, area..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}

                </div>

                {/* City */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.city}
                    </p>
                  )}

                </div>

                {/* State */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-green-500"
                  />

                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.state}
                    </p>
                  )}

                </div>

              </div>
            </section>

            {/* =====================================
                PAYMENT
            ====================================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">

                {/* Cash on Delivery */}

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>

                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>

                  </div>

                </label>

                {/* UPI */}

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>

                    <p className="font-semibold">
                      UPI
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay using UPI.
                    </p>

                  </div>

                </label>

                {/* Card */}

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>

                    <p className="font-semibold">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay using your card.
                    </p>

                  </div>

                </label>

              </div>

            </section>

          </div>

          {/* =====================================
              RIGHT SIDE
          ====================================== */}

          <div>

            <section className="sticky top-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              {/* Products */}

              <div className="mt-5 space-y-4">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />

                      <div>

                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm font-semibold">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>

                ))}

              </div>

              <hr className="my-5 border-gray-200" />

              {/* Prices */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-gray-600">

                  <span>
                    Subtotal ({totalItems} items)
                  </span>

                  <span>
                    ₹{subtotal}
                  </span>

                </div>

                <div className="flex justify-between text-gray-600">

                  <span>
                    Delivery Charges
                  </span>

                  <span className="font-medium text-green-600">
                    FREE
                  </span>

                </div>

                <div className="flex justify-between text-gray-600">

                  <span>
                    Discount
                  </span>

                  <span>
                    ₹{discount}
                  </span>

                </div>

              </div>

              <hr className="my-5 border-gray-200" />

              {/* Total */}

              <div className="flex justify-between text-lg font-bold text-gray-900">

                <span>
                  Total Amount
                </span>

                <span>
                  ₹{total}
                </span>

              </div>

              {/* Place Order */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                Place Order
              </button>

              <Link
                to="/cart"
                className="mt-3 block w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back to Cart
              </Link>

            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;