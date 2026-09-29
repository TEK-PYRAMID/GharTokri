// Owner: Sayeed
// Page: Home (Enhanced with modern Hero Carousel, Flash Deals, Interactive Category Tabs, Value Badges & VIP Offers)

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Banner from "../../components/home/Banner";
import PromoStrip from "../../components/home/PromoStrip";
import CategoryCard from "../../components/home/CategoryCard";
import ProductCard from "../../components/home/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import productService from "../../services/productService";

// Hero slides data with rich imagery and distinct themes
const HERO_SLIDES = [
  {
    id: "slide-1",
    tag: "🌿 100% FARM-FRESH GUARANTEE",
    tagColor: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    title: "Crisp Farm Veggies & Fresh Fruits in 10 Mins",
    description:
      "Handpicked organic greens, exotic fruits & daily staples delivered straight from local growers to your kitchen counter.",
    primaryCta: "Shop Fresh Harvest",
    primaryLink: "/categories/fruits-vegetables",
    secondaryCta: "Explore All Aisles",
    secondaryLink: "/categories",
    gradient: "from-emerald-950 via-teal-900 to-emerald-900",
    accentColor: "from-emerald-400 to-teal-300",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
    badge1: { icon: "⚡", label: "10-15 Min Delivery", sub: "Hyperlocal speed" },
    badge2: { icon: "⭐", label: "4.9/5 Rating", sub: "50,000+ Happy homes" },
  },
  {
    id: "slide-2",
    tag: "🥐 BAKED FRESH EVERY MORNING",
    tagColor: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    title: "Warm Artisanal Breads, Golden Croissants & Dairy",
    description:
      "Wake up to oven-fresh sourdough loaves, flaky croissants, farm-churned butter, and wholesome cow milk ready for breakfast.",
    primaryCta: "Shop Bakery Specials",
    primaryLink: "/categories/bakery",
    secondaryCta: "View Dairy & Eggs",
    secondaryLink: "/categories/dairy-eggs",
    gradient: "from-amber-950 via-orange-900 to-amber-900",
    accentColor: "from-amber-300 to-yellow-400",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    badge1: { icon: "🥖", label: "Baked at 5 AM", sub: "100% Fresh Daily" },
    badge2: { icon: "🥛", label: "Pure Farm Milk", sub: "Direct from dairy" },
  },
  {
    id: "slide-3",
    tag: "🍿 MIDNIGHT MUNCHIES & DRINKS",
    tagColor: "bg-purple-500/20 text-purple-200 border-purple-400/30",
    title: "Gourmet Snacks, Chilled Brews & Sweet Treats",
    description:
      "Satisfy your sudden cravings with artisan potato chips, imported chocolates, refreshing sparkling water, and cold brew coffees.",
    primaryCta: "Explore Snacks & Drinks",
    primaryLink: "/categories/snacks-beverages",
    secondaryCta: "Browse Catalog",
    secondaryLink: "/products",
    gradient: "from-purple-950 via-indigo-900 to-slate-900",
    accentColor: "from-pink-400 to-purple-300",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    badge1: { icon: "🍫", label: "Flat 25% Off", sub: "On snack combos" },
    badge2: { icon: "🧊", label: "Ice-Cold Drop", sub: "Delivered chilled" },
  },
];

// Trending search shortcuts
const TRENDING_CHIPS = [
  { label: "Fresh Apples", icon: "🍎", link: "/products?search=Apples" },
  { label: "Pure Cow Milk", icon: "🥛", link: "/products?search=Milk" },
  { label: "Warm Croissants", icon: "🥐", link: "/products?search=Croissants" },
  { label: "Hass Avocados", icon: "🥑", link: "/products?search=Avocados" },
  { label: "Sourdough Loaf", icon: "🥖", link: "/products?search=Sourdough" },
  { label: "Dark Chocolate", icon: "🍫", link: "/products?search=Chocolate" },
  { label: "Cold Brew Coffee", icon: "☕", link: "/products?search=Coffee" },
];

// Value proposition pillars
const VALUE_PILLARS = [
  {
    icon: "⚡",
    title: "10-15 Min Delivery",
    desc: "Lightning fast from our hyperlocal fulfillment hubs right to your door.",
    bgColor: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  {
    icon: "🌿",
    title: "Farm-Fresh Quality",
    desc: "Directly sourced from certified local growers with zero cold storage delays.",
    bgColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  {
    icon: "💸",
    title: "Best Price Guarantee",
    desc: "Unbeatable wholesale rates and daily flash deals with zero markups.",
    bgColor: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    icon: "🔄",
    title: "Instant 24h Refunds",
    desc: "Not 100% happy with an item? Get an instant no-questions-asked refund.",
    bgColor: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
];

// Customer Reviews
const TESTIMONIALS = [
  {
    name: "Priya Nair",
    city: "Bengaluru",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
    comment:
      "GharTokri has completely transformed our weekday routine. Crisp spinach, strawberries, and farm milk arrived in 11 minutes flat!",
    verified: "Verified Buyer",
  },
  {
    name: "Vikram Sharma",
    city: "Mumbai",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    comment:
      "The bakery items are genuinely fresh out of the oven. Sourdough loaf and butter croissants were still warm. 10/10 experience!",
    verified: "Verified Buyer",
  },
  {
    name: "Sneha Mukherjee",
    city: "Pune",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    comment:
      "Super responsive customer support. Had a minor issue with one avocado and got an instant refund in seconds. Highly recommended!",
    verified: "Verified Buyer",
  },
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [homeCategories, setHomeCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Interactive Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Active Category Filter for "Curated For You" Section
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Copy coupon feedback
  const [copiedCode, setCopiedCode] = useState(null);

  // Flash Deals Countdown Timer
  const [countdown, setCountdown] = useState({
    hours: "04",
    minutes: "38",
    seconds: "45",
  });

  // Load Data
  const loadData = () => {
    setLoading(true);
    setError(false);

    Promise.all([
      productService.getCategories(),
      productService.getFeatured(),
      productService.getProducts(),
    ])
      .then(([categoriesData, featuredData, allProductsData]) => {
        setHomeCategories(categoriesData || []);
        setProducts(featuredData || []);
        setAllProducts(allProductsData || featuredData || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-advance Carousel
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  // Flash Sale Timer ticking
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Calculate remaining seconds until end of the day or 5-hour cycle
      const totalSecs =
        (24 * 3600 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())) % (6 * 3600);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      setCountdown({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Coupon Copy
  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2400);
  };

  // Filtered Products for the "Curated For You" Tab
  const displayedProducts = useMemo(() => {
    const pool = allProducts.length > 0 ? allProducts : products;
    if (selectedCategory === "All") {
      return pool.slice(0, 8);
    }
    const filtered = pool.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
    return filtered.length > 0 ? filtered.slice(0, 8) : pool.slice(0, 8);
  }, [selectedCategory, allProducts, products]);

  // Flash Deal Products (take 4 items from the pool)
  const flashDealProducts = useMemo(() => {
    const pool = allProducts.length > 0 ? allProducts : products;
    return pool.slice(2, 6);
  }, [allProducts, products]);

  // Dynamic category pill list from categories
  const categoryFilterList = useMemo(() => {
    const names = homeCategories.map((c) => c.name);
    return ["All", ...names];
  }, [homeCategories]);

  if (loading) {
    return <Loader message="Stocking the freshest groceries for you..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="We couldn't load the homepage right now."
        onRetry={loadData}
      />
    );
  }

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* 1. TOP SMART ANNOUNCEMENT RIBBON */}
      <div className="border-b border-yellow-200/60 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 px-4 py-2 text-xs font-semibold text-gray-900 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-green-700"></span>
            <span className="font-bold">⚡ Express 10-Minute Delivery Active</span>
            <span className="hidden text-gray-700 sm:inline">• Free delivery on orders above ₹499</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-800">Use code:</span>
            <button
              onClick={() => handleCopyCoupon("QUICK100")}
              className="inline-flex items-center gap-1 rounded-md border border-amber-600/40 bg-white/90 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-900 shadow-2xs transition hover:bg-white active:scale-95"
              title="Click to copy coupon code"
            >
              <span>QUICK100</span>
              <span className="text-[10px] text-amber-700">
                {copiedCode === "QUICK100" ? "✓ Copied!" : "📋 Copy"}
              </span>
            </button>
            <span className="hidden text-amber-950/80 md:inline">for ₹100 OFF</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-6 sm:px-6 lg:px-8">
        {/* 2. DYNAMIC HERO CAROUSEL */}
        <section
          className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-700"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          <div
            className={`relative min-h-[460px] bg-gradient-to-br ${currentSlide.gradient} px-6 py-12 text-white sm:px-12 sm:py-16 lg:min-h-[500px] lg:px-16 flex items-center`}
          >
            {/* Ambient Background Glow Orbs */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 w-full">
              {/* Slide Content */}
              <div className="flex flex-col items-start lg:col-span-7">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase backdrop-blur-md ${currentSlide.tagColor}`}
                >
                  {currentSlide.tag}
                </span>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {currentSlide.title}
                </h1>

                <p className="mt-4 max-w-xl text-base text-gray-200/90 sm:text-lg leading-relaxed">
                  {currentSlide.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={currentSlide.primaryLink}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-3 text-sm font-bold text-gray-900 shadow-lg shadow-yellow-500/20 transition duration-200 hover:from-yellow-300 hover:to-amber-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>{currentSlide.primaryCta}</span>
                    <span className="text-base">→</span>
                  </Link>

                  <Link
                    to={currentSlide.secondaryLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:bg-white/20 active:scale-95"
                  >
                    <span>{currentSlide.secondaryCta}</span>
                  </Link>
                </div>

                {/* Micro Guarantee Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300">✓</span>
                    <span>No Minimum Order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/30 text-yellow-300">✓</span>
                    <span>100% Quality Assurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30 text-blue-300">✓</span>
                    <span>Instant Doorstep Return</span>
                  </div>
                </div>
              </div>

              {/* Slide Visual / Image Showcase */}
              <div className="relative lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative backdrop shadow */}
                  <div className="absolute inset-0 rotate-3 rounded-3xl bg-gradient-to-tr from-yellow-400/20 to-emerald-400/20 blur-xl"></div>

                  <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-white/5 p-2 shadow-2xl backdrop-blur-md">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="h-64 sm:h-80 w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Floating Badge 1 */}
                    <div className="absolute top-5 left-5 flex items-center gap-2.5 rounded-xl border border-white/20 bg-gray-900/80 px-3.5 py-2 shadow-lg backdrop-blur-md">
                      <span className="text-xl">{currentSlide.badge1.icon}</span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white leading-tight">
                          {currentSlide.badge1.label}
                        </span>
                        <span className="text-[10px] text-gray-300">
                          {currentSlide.badge1.sub}
                        </span>
                      </div>
                    </div>

                    {/* Floating Badge 2 */}
                    <div className="absolute bottom-5 right-5 flex items-center gap-2.5 rounded-xl border border-white/20 bg-gray-900/80 px-3.5 py-2 shadow-lg backdrop-blur-md">
                      <span className="text-xl">{currentSlide.badge2.icon}</span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white leading-tight">
                          {currentSlide.badge2.label}
                        </span>
                        <span className="text-[10px] text-yellow-400">
                          {currentSlide.badge2.sub}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="absolute bottom-4 left-6 sm:left-12 flex items-center gap-2 z-20">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-yellow-400"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <button
              onClick={() =>
                setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60 sm:left-4"
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60 sm:right-4"
              aria-label="Next Slide"
            >
              ›
            </button>
          </div>
        </section>

        {/* 3. TRENDING SEARCH SHORTCUTS */}
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-xs">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
            <span>🔥</span>
            <span>Trending Searches:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {TRENDING_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                to={chip.link}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-gray-50/70 px-3 py-1 text-xs font-medium text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800 active:scale-95"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. VALUE PROPOSITION CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl font-bold transition duration-200 group-hover:scale-110 ${pillar.bgColor}`}
              >
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{pillar.title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 5. SHOP BY CATEGORY SECTION */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-700">
                <span>🛒</span>
                <span>Explore Our Aisles</span>
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
                Shop by Category
              </h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                Fresh farm picks, dairy essentials, bakery goods, and everyday groceries.
              </p>
            </div>

            <Link
              to="/categories"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-yellow-200 bg-yellow-50/70 px-4 py-2 text-xs font-bold text-yellow-800 transition hover:bg-yellow-400 hover:text-gray-950 active:scale-95"
            >
              <span>View All Categories</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {homeCategories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Categories will show up here once they're added."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 sm:gap-4">
              {homeCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </section>

        {/* 6. FLASH DEALS / DEAL OF THE DAY WITH LIVE COUNTDOWN */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-yellow-50/50 to-orange-500/10 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/50 pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-xl text-white shadow-md shadow-amber-500/30">
                ⚡
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                    Flash Deals of the Day
                  </h2>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                </div>
                <p className="text-xs text-gray-600 sm:text-sm">
                  Limited time deals on daily favorites — up to 35% off!
                </p>
              </div>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-white px-4 py-2 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Ends In:</span>
              <div className="flex items-center gap-1 font-mono text-xs font-black text-gray-900">
                <span className="rounded-md bg-gray-900 px-2 py-1 text-white">
                  {countdown.hours}
                </span>
                <span>:</span>
                <span className="rounded-md bg-gray-900 px-2 py-1 text-white">
                  {countdown.minutes}
                </span>
                <span>:</span>
                <span className="rounded-md bg-red-600 px-2 py-1 text-white">
                  {countdown.seconds}
                </span>
              </div>
            </div>
          </div>

          {flashDealProducts.length === 0 ? (
            <EmptyState
              title="No flash deals right now"
              message="Check back soon for new flash deals!"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {flashDealProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 right-2 z-10 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                    SALE -25%
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. DUAL PROMOTIONAL FEATURE BANNERS */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Banner Left: Farm Harvest */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-green-800 to-teal-900 p-8 text-white shadow-md">
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
            <div className="relative z-10 max-w-sm">
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
                ORGANIC HARVEST
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                100% Direct From Local Farmers
              </h3>
              <p className="mt-2 text-xs text-emerald-100 sm:text-sm leading-relaxed">
                Pesticide-free seasonal fruits, herbs, and greens freshly picked at 4 AM every single morning.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  to="/categories/fruits-vegetables"
                  className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-95 shadow-sm"
                >
                  Shop Veggies & Fruits →
                </Link>
                <span className="text-xs font-semibold text-emerald-200">
                  Flat 30% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Banner Right: Bakery & Breakfast */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-800 to-amber-900 p-8 text-white shadow-md">
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-yellow-400/10 blur-2xl"></div>
            <div className="relative z-10 max-w-sm">
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200 border border-amber-400/30">
                BREAKFAST SPECIALS
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Morning Artisanal Bakery Combos
              </h3>
              <p className="mt-2 text-xs text-amber-100 sm:text-sm leading-relaxed">
                Sourdough, golden croissants, and farm eggs bundled for the ultimate Sunday breakfast feast.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  to="/categories/bakery"
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-bold text-gray-900 transition hover:bg-yellow-300 active:scale-95 shadow-sm"
                >
                  Explore Bakery Combos →
                </Link>
                <span className="text-xs font-semibold text-amber-200">
                  Starts @ ₹149
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FEATURED PRODUCTS WITH CATEGORY FILTER TABS */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-600">
                <span>⭐</span>
                <span>Handpicked Picks</span>
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
                Featured Products For You
              </h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                Browse our top customer favorites with quick add-to-cart.
              </p>
            </div>

            <Link
              to="/products"
              className="text-xs font-bold text-yellow-700 hover:text-yellow-800 transition"
            >
              See All {allProducts.length > 0 ? allProducts.length : 100}+ Items →
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
            {categoryFilterList.map((catName) => {
              const isActive = selectedCategory === catName;
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition duration-200 active:scale-95 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 shadow-sm shadow-yellow-400/30"
                      : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>

          {displayedProducts.length === 0 ? (
            <EmptyState
              title="No products found in this category"
              message="Try picking another category or browsing our full product catalog."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-95 shadow-md"
            >
              <span>Explore Complete Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 9. VIP DISCOUNT / FIRST ORDER PROMO CARD */}
        <section className="relative overflow-hidden rounded-3xl border border-yellow-300 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 p-8 shadow-md">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/30 blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-bold text-yellow-300 uppercase">
                🎉 Welcome Offer
              </span>
              <h3 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">
                Get ₹150 OFF on Your First Order!
              </h3>
              <p className="mt-1 text-xs text-gray-800 sm:text-sm max-w-lg">
                Use the coupon code below during checkout on any grocery basket over ₹499.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center rounded-xl border-2 border-dashed border-gray-900/60 bg-white/95 px-4 py-2.5 shadow-xs">
                <span className="font-mono text-base font-black text-gray-900 tracking-wider">
                  WELCOME150
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon("WELCOME150")}
                  className="ml-3 rounded-lg bg-gray-900 px-3 py-1 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-95"
                >
                  {copiedCode === "WELCOME150" ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>

              <Link
                to="/products"
                className="rounded-xl bg-gray-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-95"
              >
                Start Shopping Now
              </Link>
            </div>
          </div>
        </section>

        {/* 10. WHY CUSTOMERS TRUST GHARTOKRI */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-700">
              <span>❤️</span>
              <span>Loved By Foodies</span>
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Why 100,000+ Families Choose GharTokri
            </h2>
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              We are obsessed with bringing you the freshest greens, speediest delivery, and happiest customer experience every single day.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-10 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-6 sm:grid-cols-4 text-center">
            <div>
              <div className="text-2xl font-black text-gray-900 sm:text-3xl">1,000,000+</div>
              <div className="mt-1 text-xs font-medium text-gray-500">Orders Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-600 sm:text-3xl">11.4 Mins</div>
              <div className="mt-1 text-xs font-medium text-gray-500">Avg. Delivery Time</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-500 sm:text-3xl">350+</div>
              <div className="mt-1 text-xs font-medium text-gray-500">Organic Farm Partners</div>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 sm:text-3xl">4.9 / 5.0</div>
              <div className="mt-1 text-xs font-medium text-gray-500">App Rating (45k reviews)</div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:border-yellow-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                    {"★".repeat(t.rating)}
                  </div>
                  <p className="text-xs text-gray-600 sm:text-sm leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <span className="text-[10px] text-green-600 font-semibold">
                      ✓ {t.verified} • {t.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. ORIGINAL PROMO STRIP (Preserved for total compatibility) */}
        <PromoStrip />
      </div>
    </div>
  );
};

export default Home;
