// Owner: Poorvika

import apiClient from './apiClient.js';
import { categories as fallbackCategories } from '../data/categories.js';
import { featuredProducts as fallbackProducts } from '../data/featuredProducts.js';

const productService = {
  // Get all categories from db
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (err) {
      console.warn('API error fetching categories, falling back to local data:', err.message);
      return fallbackCategories;
    }
  },

  // Get products from db (with optional category filter)
  getProducts: async (categoryName) => {
    try {
      const params = categoryName ? { category: categoryName } : {};
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (err) {
      console.warn('API error fetching products, falling back to local data:', err.message);
      if (categoryName) {
        return fallbackProducts.filter(
          (p) => p.category?.toLowerCase() === categoryName.toLowerCase()
        );
      }
      return fallbackProducts;
    }
  },

  // Get featured products
  getFeatured: async () => {
    try {
      const response = await apiClient.get('/featuredProducts');
      return response.data;
    } catch (err) {
      console.warn('API error fetching featured products, falling back to local data:', err.message);
      return fallbackProducts;
    }
  },

  // Get single product by id
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      console.warn('API error fetching product by id, falling back to local data:', err.message);
      return fallbackProducts.find((p) => String(p.id) === String(id));
    }
  },
};

export default productService;

