// Owner: Sayeed
// Page: Home

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../../components/home/Banner";
import PromoStrip from "../../components/home/PromoStrip";
import CategoryCard from "../../components/home/CategoryCard";
import ProductCard from "../../components/home/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { categories } from "../../data/categories";
import { featuredProducts } from "../../data/featuredProducts";

// TODO: once productService.js (Poorvika) exposes real endpoints,
// replace the local data below with productService.getCategories() /
// productService.getFeatured(), inside the same async block.
const fetchHomeData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ categories, products: featuredProducts });
    }, 400);
  });

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [homeCategories, setHomeCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const loadData = () => {
    setLoading(true);
    setError(false);

    fetchHomeData()
      .then((data) => {
        setHomeCategories(data.categories);
        setProducts(data.products);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loader message="Loading fresh picks for you..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="We couldn't load the homepage right now."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6">
      <Banner />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Shop by Category
          </h2>
          <Link
            to="/categories"
            className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition"
          >
            View All →
          </Link>
        </div>

        {homeCategories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            message="Categories will show up here once they're added."
          />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {homeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Featured Products
          </h2>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No featured products"
            message="Check back soon for today's picks."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <PromoStrip />
    </div>
  );
};

export default Home;
