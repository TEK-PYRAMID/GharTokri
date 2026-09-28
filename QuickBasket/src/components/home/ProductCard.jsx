// Owner: Sayeed (Home & Categories)
// "Reusable product sections" per PRD — used on Home's Featured Products grid.
// Add-to-cart wiring is intentionally minimal: it uses the CartContext shape
// as it exists today (cartItems/setCartItems). Mubeena's real cart logic
// (quantities, totals, persistence) should replace/extend this as it lands —
// this just keeps Home functional and integration-tested in the meantime.

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const getPrice = (item) => {
  if (item?.price) return item.price;
  const num = parseInt(String(item?.id || "").replace(/\D/g, "") || "1", 10);
  const basePrices = [49, 65, 89, 35, 120, 150, 75, 99, 110, 180, 45, 135, 70, 95, 160, 210];
  return basePrices[num % basePrices.length];
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const cart = useCart();
  const price = getPrice(product);
  const productWithPrice = { ...product, price };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!cart) return;

    if (cart.addToCart) {
      cart.addToCart(productWithPrice, 1);
    } else {
      const { cartItems, setCartItems } = cart;
      const existing = cartItems?.find((item) => item.id === product.id);

      if (existing) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems([...(cartItems || []), { ...productWithPrice, quantity: 1 }]);
      }
    }

    // Navigate to cart page as requested
    navigate("/cart",);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm backdrop-blur-xs">
            {product.category}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-gray-800 line-clamp-2 transition hover:text-green-700"
          title={product.name}
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Price</span>
            <span className="text-base font-bold text-gray-900">
              ₹{price}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
          >
            <span>+</span> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

