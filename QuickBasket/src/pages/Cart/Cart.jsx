// Owner: Mubeena
// Page: Cart

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const cart = useCart();

  if (!cart) {
    return <p className="p-6 text-center">Cart context not found.</p>;
  }

  const { cartItems = [], setCartItems } = cart;

  // Increase quantity
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove product
  const removeItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total quantity
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
        <div className="text-7xl">🛒</div>

        <h2 className="text-2xl font-bold text-gray-800">
          Your cart is empty
        </h2>

        <p className="text-gray-500">
          Add some products to your cart to get started.
        </p>

        <Link
          to="/"
          className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {totalItems} item(s) in your cart
            </p>
          </div>

          <button
            onClick={clearCart}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* Cart Products */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {/* Product Image */}
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full rounded-lg object-cover sm:w-28"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col gap-2">
                  <Link
                    to={`/products/${item.id}`}
                    className="font-semibold text-gray-800 hover:text-green-700"
                  >
                    {item.name}
                  </Link>

                  {item.category && (
                    <p className="text-sm text-gray-500">
                      {item.category}
                    </p>
                  )}

                  <p className="font-bold text-gray-900">
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="min-w-5 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal and Remove */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="font-bold text-green-700">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/"
              className="inline-block text-sm font-semibold text-green-700 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-medium text-green-600">
                  FREE
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>₹0</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Proceeding to checkout!")}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Delivery charges are free on this order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;