// Owner: Ramya
// Page: ProductListing

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../../services/productService";
import ProductCard from "../../components/home/ProductCard";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getProducts();

      const filteredProducts = search.trim()
        ? data.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      setProducts(filteredProducts);
    };

    loadProducts();
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {search ? `Search results for "${search}"` : "All Products"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
