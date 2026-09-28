// Owner: Sayeed (Home & Categories)
// Reusable across Home (quick nav) and Categories (full grid)

import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-100 bg-white p-3.5 text-center shadow-xs transition duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-md active:scale-95"
    >
      <div className="overflow-hidden rounded-full border-2 border-yellow-100 p-0.5 transition duration-200 group-hover:border-yellow-400">
        <img
          src={category.image}
          alt={category.name}
          className="h-16 w-16 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <span className="text-xs font-semibold text-gray-800 transition group-hover:text-yellow-600 sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
