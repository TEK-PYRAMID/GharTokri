// Owner: Sayeed
// Page: Categories

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CategoryCard from "../../components/home/CategoryCard";
import ProductCard from "../../components/home/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { categories } from "../../data/categories";
import { featuredProducts } from "../../data/featuredProducts";

// TODO: replace with productService.getCategories() & productService.getProducts() once the backend is wired in.
const fetchCategoriesAndProducts = () =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          categories,
          products: featuredProducts,
        }),
      300
    );
  });

const Categories = () => {
  const { category: categorySlug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const loadData = () => {
    setLoading(true);
    setError(false);

    fetchCategoriesAndProducts()
      .then((data) => {
        setAllCategories(data.categories);
        setAllProducts(data.products);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Determine active category object from route parameter
  const activeCategory = useMemo(() => {
    if (!categorySlug || categorySlug === "all") return null;
    return allCategories.find(
      (c) =>
        c.slug.toLowerCase() === categorySlug.toLowerCase() ||
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categorySlug.toLowerCase()
    );
  }, [categorySlug, allCategories]);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    if (!activeCategory) {
      if (categorySlug && categorySlug !== "all") {
        // Fallback matching if slug format differs
        const matched = allProducts.filter(
          (p) =>
            p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categorySlug.toLowerCase() ||
            p.category.toLowerCase().includes(categorySlug.toLowerCase())
        );
        if (matched.length > 0) return matched;
      }
      return allProducts;
    }
    return allProducts.filter(
      (p) => p.category.toLowerCase() === activeCategory.name.toLowerCase()
    );
  }, [activeCategory, categorySlug, allProducts]);

  // Filter and sort products
  const displayProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || 99) - (b.price || 99));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || 99) - (a.price || 99));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [categoryProducts, searchTerm, sortBy]);

  if (loading) {
    return <Loader message="Loading categories & products..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="We couldn't load categories right now."
        onRetry={loadData}
      />
    );
  }

  if (allCategories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        message="Categories will show up here once they're added."
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-yellow-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-yellow-600 transition">
          Categories
        </Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="font-semibold text-gray-900">
              {activeCategory.name}
            </span>
          </>
        )}
      </nav>

      {/* Header Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-50 via-amber-50 to-emerald-50 p-6 border border-yellow-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeCategory ? activeCategory.name : "Shop by Category"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {activeCategory
                ? `Showing fresh and top quality ${activeCategory.name.toLowerCase()} for daily essentials.`
                : "Select any category below to discover freshly picked groceries."}
            </p>
          </div>
          <span className="self-start rounded-full bg-yellow-400/30 px-3.5 py-1 text-xs font-semibold text-gray-800 border border-yellow-300/60">
            ⚡ {categoryProducts.length} items
          </span>
        </div>

        {/* Category Navigation Pills / Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              !categorySlug
                ? "bg-yellow-400 text-gray-900 shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>🧺</span> All Categories
          </button>

          {allCategories.map((cat) => {
            const isActive =
              categorySlug === cat.slug ||
              (activeCategory && activeCategory.id === cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/categories/${cat.slug}`)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-yellow-400 text-gray-900 shadow-sm ring-1 ring-yellow-500"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* When no specific category is in the route, also show the visual Categories Grid */}
      {!categorySlug && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            All Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {allCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Category Products Section */}
      <section>
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeCategory ? `${activeCategory.name} Products` : "All Products"}
          </h2>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3">
            {/* Quick search */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-900 shadow-xs focus:border-yellow-500 focus:outline-hidden"
              />
              <span className="absolute left-2.5 top-2 text-xs text-gray-400">
                🔍
              </span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-xs focus:border-yellow-500 focus:outline-hidden"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            message={
              searchTerm
                ? `No products match "${searchTerm}".`
                : "No products available in this category."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Categories;
