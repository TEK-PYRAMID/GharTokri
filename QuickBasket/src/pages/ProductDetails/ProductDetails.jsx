// Owner: Poorvika
// Page: ProductDetails (Blinkit-style)

import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../../services/productService.js";
import { useCart } from "../../context/CartContext.jsx";
import ProductCard from "../../components/home/ProductCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToast, setAddedToast] = useState(false);

  // New review form modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product data from database
  const loadProduct = () => {
    setLoading(true);
    setError(false);

    productService
      .getProductById(id)
      .then((data) => {
        if (!data) {
          setError(true);
        } else {
          setProduct(data);
          setReviews(data.reviews || []);

          // Fetch related products from same category from db
          if (data.category) {
            productService
              .getProducts(data.category)
              .then((items) => {
                const filtered = (items || []).filter((p) => p.id !== data.id).slice(0, 4);
                setRelatedProducts(filtered);
              })
              .catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.error("Error loading product from database:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedUnitIndex(0);
    setQuantity(1);
  }, [id]);

  // Unit options directly from database product object
  const unitOptions = useMemo(() => {
    if (product?.unitOptions && product.unitOptions.length > 0) {
      return product.unitOptions;
    }
    return [
      {
        id: "opt-1",
        label: "Standard Pack",
        unitText: "1 Unit",
        price: product?.price || 65,
        mrp: product?.mrp || Math.round((product?.price || 65) * 1.3),
        savingsPercent: product?.savingsPercent || 23,
      },
    ];
  }, [product]);

  const currentUnit = unitOptions[selectedUnitIndex] || unitOptions[0];

  // Check if item is already in cart
  const cartItem = useMemo(() => {
    if (!cart?.cartItems) return null;
    return cart.cartItems.find((item) => item.id === product?.id);
  }, [cart?.cartItems, product?.id]);

  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!product || !cart) return;

    const productToAdd = {
      ...product,
      price: currentUnit.price,
      selectedUnit: currentUnit.label,
    };

    if (cart.addToCart) {
      cart.addToCart(productToAdd, quantity);
    } else if (cart.setCartItems) {
      const { cartItems, setCartItems } = cart;
      const existing = cartItems?.find((item) => item.id === product.id);
      if (existing) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setCartItems([
          ...(cartItems || []),
          { ...productToAdd, quantity },
        ]);
      }
    }

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleUpdateCartQuantity = (delta) => {
    if (!cart?.setCartItems || !cartItem) return;
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      cart.setCartItems(cart.cartItems.filter((i) => i.id !== product.id));
    } else {
      cart.setCartItems(
        cart.cartItems.map((i) =>
          i.id === product.id ? { ...i, quantity: newQty } : i
        )
      );
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setSubmittingReview(true);

    const newRev = {
      id: "rev-" + Date.now(),
      author: newReviewAuthor.trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newReviewAuthor)}`,
      rating: newReviewRating,
      date: "Just now",
      verified: true,
      comment: newReviewComment.trim(),
      likes: 0,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setShowReviewModal(false);

    // Persist new review to db.json via API
    await productService.addProductReview(product.id, newRev, reviews);
    setSubmittingReview(false);
  };

  if (loading) {
    return <Loader message="Loading fresh product details..." />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ErrorState
          message="We couldn't find the product you're looking for."
          onRetry={loadProduct}
        />
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-500"
        >
          ← Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3.5 text-white shadow-2xl transition-all">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
            ✓
          </span>
          <div className="text-xs">
            <p className="font-bold">{product.name} added to cart!</p>
            <p className="text-gray-300">
              {currentUnit.label} • ₹{currentUnit.price}
            </p>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="ml-2 rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
          >
            View Cart
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-yellow-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-yellow-600 transition">
            Categories
          </Link>
          <span>/</span>
          <Link
            to={`/categories/${product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="hover:text-yellow-600 transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-gray-900 font-semibold max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Card Grid */}
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm md:grid-cols-12 md:p-8">
          {/* Left Column: Product Image & Badges (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50 to-white p-6">
              {/* Delivery time badge (Blinkit hallmark) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                <span>⚡</span>
                <span>{product.deliveryTime || "10 MINS"}</span>
              </div>

              {/* Discount badge */}
              <div className="absolute top-4 right-4 z-10 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                {currentUnit.savingsPercent || product.savingsPercent || 20}% OFF
              </div>

              {/* Product Image */}
              <div className="flex h-72 w-full items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Assured Freshness Pill */}
              <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-emerald-800">
                <span>🌱</span>
                <span>100% Quality & Freshness Guarantee</span>
              </div>
            </div>

            {/* Quick Feature Pillars (Blinkit style) */}
            <div className="mt-5 grid w-full grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5">
                <div className="text-base">⚡</div>
                <div className="text-[11px] font-bold text-emerald-950">10 Min Delivery</div>
                <div className="text-[9px] text-gray-500">From local hub</div>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-2.5">
                <div className="text-base">🍃</div>
                <div className="text-[11px] font-bold text-amber-950">Farm Fresh</div>
                <div className="text-[9px] text-gray-500">Direct source</div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5">
                <div className="text-base">🔁</div>
                <div className="text-[11px] font-bold text-blue-950">Easy Returns</div>
                <div className="text-[9px] text-gray-500">At doorstep</div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Buy Options (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category pill */}
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-yellow-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-yellow-900 uppercase">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  <span>ID:</span>
                  <span>{product.id}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2.5 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* Ratings Summary */}
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                  <span>★</span>
                  <span>{product.rating || 4.8}</span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product.ratingCount || (reviews.length * 42)} ratings & {reviews.length} reviews)
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  • In Stock
                </span>
              </div>

              <div className="my-4 h-px w-full bg-gray-100" />

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{currentUnit.price}
                </span>
                <span className="text-base font-medium text-gray-400 line-through">
                  MRP ₹{currentUnit.mrp}
                </span>
                <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  Save ₹{currentUnit.mrp - currentUnit.price}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                (Inclusive of all taxes)
              </p>

              {/* Unit / Pack Size Options (Blinkit Hallmark) */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Unit / Pack Size:
                </label>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:gap-3">
                  {unitOptions.map((opt, idx) => {
                    const isSelected = selectedUnitIndex === idx;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedUnitIndex(idx)}
                        className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="mt-1 text-[11px] text-gray-500 font-medium">
                          ₹{opt.price}
                        </span>
                        <span className="mt-0.5 text-[9px] font-semibold text-emerald-700">
                          {opt.savingsPercent}% OFF
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector & Action Button */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {cartQuantity === 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-100 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95"
                    >
                      <span>🛒</span>
                      <span>ADD TO CART • ₹{currentUnit.price * quantity}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-xl bg-emerald-700 p-1 text-white shadow-md">
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQuantity(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold hover:bg-emerald-800 active:scale-90"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-extrabold">
                        {cartQuantity} in cart
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQuantity(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold hover:bg-emerald-800 active:scale-90"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-800 shadow-xs hover:bg-gray-100"
                    >
                      View Cart & Checkout →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Delivery Guarantee Notice */}
            <div className="mt-8 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🛵</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    Lightning 10-Minute Blinkit Delivery
                  </h4>
                  <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
                    Order now to receive fresh {product.name.toLowerCase()} at your doorstep directly from our nearest cold-chain dark store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Details & Specifications & Why Us */}
        <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3.5 text-sm font-bold transition-all mr-6 ${
                activeTab === "description"
                  ? "border-b-2 border-emerald-600 text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Product Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3.5 text-sm font-bold transition-all mr-6 ${
                activeTab === "specs"
                  ? "border-b-2 border-emerald-600 text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Key Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("whyUs")}
              className={`pb-3.5 text-sm font-bold transition-all ${
                activeTab === "whyUs"
                  ? "border-b-2 border-emerald-600 text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Why QuickBasket?
            </button>
          </div>

          {/* Tab 1: Product Description */}
          {activeTab === "description" && (
            <div className="pt-6 text-sm text-gray-700 leading-relaxed">
              <p>
                {product.description || `${product.name} is carefully sourced to ensure premier culinary grade, vibrant appearance, and wholesome nutritional value.`}
              </p>

              <h4 className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-900">
                Key Features & Benefits
              </h4>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs text-gray-600">
                {(product.keyFeatures && product.keyFeatures.length > 0 ? product.keyFeatures : [
                  "Grade-A Farm Quality: Sourced directly from certified partners under strict hygiene standards.",
                  "Nutrient Dense: Retains natural vitamins, fiber, and essential minerals.",
                  "Cold-Chain Protected: Kept at optimal temperatures to preserve freshness.",
                  "Storage Instructions: Store in a cool, ventilated compartment or refrigerate."
                ]).map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 2: Key Specifications */}
          {activeTab === "specs" && (
            <div className="pt-6">
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <tbody>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="w-1/3 px-4 py-3 font-semibold text-gray-600">Product Name</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-semibold text-gray-600">Category</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{product.category}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-600">Packaging Type</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.specifications?.packagingType || "Food-Grade Sealed Pouch / Tray"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-semibold text-gray-600">Shelf Life</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.specifications?.shelfLife || "4–6 Days from delivery date"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-600">Country of Origin</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.specifications?.countryOfOrigin || "India"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-600">FSSAI Certified</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.specifications?.fssaiLicense || "Lic. No. 10020042001923"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Why QuickBasket? */}
          {activeTab === "whyUs" && (
            <div className="pt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xl">⚡</div>
                <h5 className="mt-2 text-xs font-bold text-gray-900">Superfast Delivery</h5>
                <p className="mt-1 text-[11px] text-gray-600">
                  Dispatched within 2 minutes from nearby localized dark stores.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xl">💰</div>
                <h5 className="mt-2 text-xs font-bold text-gray-900">Best Market Prices</h5>
                <p className="mt-1 text-[11px] text-gray-600">
                  Direct farmer tie-ups pass on massive savings to your cart every day.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xl">🛡️</div>
                <h5 className="mt-2 text-xs font-bold text-gray-900">100% Quality Assurance</h5>
                <p className="mt-1 text-[11px] text-gray-600">
                  Instant no-questions-asked refund or replacement if item is damaged.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Reviews & Ratings (Blinkit style) */}
        <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Customer Ratings & Reviews
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Verified reviews from real QuickBasket shoppers
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="self-start sm:self-auto rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
            >
              ✍️ Write a Review
            </button>
          </div>

          {/* Rating Summary Card */}
          <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-12 items-center rounded-2xl bg-gray-50 p-6">
            <div className="sm:col-span-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0">
              <span className="text-5xl font-black text-gray-900">4.8</span>
              <div className="mt-1 flex text-amber-400 text-sm">★★★★★</div>
              <span className="mt-1 text-xs text-gray-500 font-medium">
                Based on {reviews.length * 42} ratings
              </span>
            </div>

            <div className="sm:col-span-8 flex flex-col gap-2">
              {[
                { stars: 5, pct: "85%", count: 120 },
                { stars: 4, pct: "10%", count: 14 },
                { stars: 3, pct: "3%", count: 4 },
                { stars: 2, pct: "1%", count: 2 },
                { stars: 1, pct: "1%", count: 2 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-gray-600">{row.stars} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-gray-400">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="h-9 w-9 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">
                        {rev.author}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>{rev.date}</span>
                        {rev.verified && (
                          <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    <span>{rev.rating}</span>
                    <span>★</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-700 leading-relaxed">
                  {rev.comment}
                </p>

                <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
                  <button
                    type="button"
                    onClick={() => {
                      setReviews((prev) =>
                        prev.map((r) =>
                          r.id === rev.id ? { ...r, likes: r.likes + 1 } : r
                        )
                      );
                    }}
                    className="flex items-center gap-1 hover:text-gray-700 transition"
                  >
                    <span>👍 Helpful</span>
                    <span>({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar / Recommended Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  More in {product.category}
                </h3>
                <p className="text-xs text-gray-500">
                  Frequently bought together with {product.name}
                </p>
              </div>
              <Link
                to={`/categories/${product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="text-xs font-semibold text-yellow-600 hover:text-yellow-700"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">
                Write a Review for {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Your Rating
                </label>
                <div className="mt-1.5 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`text-2xl transition ${
                        star <= newReviewRating
                          ? "text-amber-400 scale-110"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Review Comment
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell others about product quality, taste, freshness, and delivery experience..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Mobile View */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 line-through">
              MRP ₹{currentUnit.mrp}
            </span>
            <div className="text-lg font-black text-gray-900">
              ₹{currentUnit.price}
              <span className="text-[10px] font-normal text-gray-500 ml-1">
                / {currentUnit.label}
              </span>
            </div>
          </div>

          {cartQuantity === 0 ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
            >
              ADD TO CART
            </button>
          ) : (
            <div className="flex items-center rounded-xl bg-emerald-700 px-2 py-1 text-white">
              <button
                type="button"
                onClick={() => handleUpdateCartQuantity(-1)}
                className="px-2 text-base font-bold"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold">{cartQuantity}</span>
              <button
                type="button"
                onClick={() => handleUpdateCartQuantity(1)}
                className="px-2 text-base font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

