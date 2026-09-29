import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (value) {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/products");
    }

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Logo size="md" onClick={closeMenu} />

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:flex"
        >
          <div className="flex w-full max-w-md items-center">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />

            <button
              type="submit"
              className="ml-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500"
            >
              Search
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-yellow-500"
          >
            Home
          </Link>

          <Link
            to="/categories"
            className="font-medium text-gray-700 transition hover:text-yellow-500"
          >
            Categories
          </Link>

          <Link
            to="/products"
            className="font-medium text-gray-700 transition hover:text-yellow-500"
          >
            Products
          </Link>

          {user && (
            <Link
              to="/profile"
              className="font-medium text-gray-700 transition hover:text-yellow-500"
            >
              Profile
            </Link>
          )}

          <Link
            to="/cart"
            className="rounded-lg px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            🛒 Cart
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-yellow-400 px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto rounded-lg border border-gray-300 px-3 py-2 text-xl text-gray-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm md:hidden">

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="mb-4 flex gap-2"
          >
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />

            <button
              type="submit"
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-500"
            >
              Search
            </button>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-yellow-50"
            >
              🏠 Home
            </Link>

            <Link
              to="/categories"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-yellow-50"
            >
              📂 Categories
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-yellow-50"
            >
              🛍️ Products
            </Link>

            {user && (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-yellow-50"
              >
                👤 Profile
              </Link>
            )}

            <Link
              to="/cart"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 font-semibold text-gray-900 hover:bg-yellow-50"
            >
              🛒 Cart
            </Link>

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg border border-yellow-400 px-3 py-3 font-semibold text-gray-900 hover:bg-yellow-400"
            >
              Login
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;