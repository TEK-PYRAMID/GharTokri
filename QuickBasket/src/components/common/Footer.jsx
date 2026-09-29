import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">

        <div className="flex flex-col gap-2">
          <Logo size="md" showTagline={true} />
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gray-900">
            Quick Links
          </h4>

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/" className="transition hover:text-yellow-500">
              Home
            </Link>

            <Link to="/categories" className="transition hover:text-yellow-500">
              Categories
            </Link>

            <Link to="/products" className="transition hover:text-yellow-500">
              Products
            </Link>

            <Link to="/cart" className="transition hover:text-yellow-500">
              Cart
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gray-900">
            Customer Support
          </h4>

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/about" className="transition hover:text-yellow-500">
              About Us
            </Link>

            <Link to="/contact" className="transition hover:text-yellow-500">
              Contact Us
            </Link>

            <Link to="/privacy" className="transition hover:text-yellow-500">
              Privacy Policy
            </Link>

            <Link to="/terms" className="transition hover:text-yellow-500">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-200">
        <p className="px-4 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GharTokri. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;