// Owner: Prashant (Architecture & Shared UI) — routing foundation
// Individual routes wired in by each page's owner

import { Routes, Route } from 'react-router-dom';
import React from "react";
import Home from '../pages/Home';
import Categories from '../pages/Categories';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import OTPVerification from '../pages/OTPVerification';
import ForgotPassword from '../pages/ForgotPassword';
import ProductListing from '../pages/ProductListing';
import ProductDetails from '../pages/ProductDetails';
import SearchResults from '../pages/SearchResults';
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';
import AddressManagement from '../pages/AddressManagement';
import Checkout from '../pages/Checkout';
import Payment from '../pages/Payment';
import OrderConfirmation from '../pages/OrderConfirmation';
import MyOrders from '../pages/MyOrders';
import OrderDetails from '../pages/OrderDetails';
import OrderTracking from '../pages/OrderTracking';
import Profile from '../pages/Profile';
import AccountSettings from '../pages/AccountSettings';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/categories/:category" element={<Categories />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/otp-verification" element={<OTPVerification />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/products" element={<ProductListing />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/addresses" element={<AddressManagement />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/payment" element={<Payment />} />
    <Route path="/order-confirmation" element={<OrderConfirmation />} />
    <Route path="/orders" element={<MyOrders />} />
    <Route path="/orders/:id" element={<OrderDetails />} />
    <Route path="/orders/:id/tracking" element={<OrderTracking />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/account-settings" element={<AccountSettings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
