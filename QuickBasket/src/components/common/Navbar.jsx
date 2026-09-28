import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-lg font-bold text-gray-900">
            QB
          </span>

          <span className="text-2xl font-bold text-gray-900">
            Quick<span className="text-yellow-500">Basket</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
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

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full border border-yellow-400 px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            👤 Profile
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-3 py-2 text-xl text-gray-700 md:hidden"
        >
          ☰
        </button>

      </div>
    </nav>
  );
};

export default Navbar;