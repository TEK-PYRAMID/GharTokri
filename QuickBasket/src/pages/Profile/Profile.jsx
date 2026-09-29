import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>
          <p className="mt-2 text-gray-600">Log in to view your account details.</p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-[#f8c600] px-6 py-3 font-semibold text-gray-900 transition hover:bg-[#eab800]"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const profileImage =
    user.profileImage || user.image || user.avatar || user.photoURL;
  const initials = user.name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <main className="min-h-[60vh] bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md">
        <div className="h-2 bg-[#f8c600]" />
        <div className="p-8">
          <div className="flex items-center gap-5">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user.name ? `${user.name}'s profile` : "Profile"}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fff4bf] text-xl font-bold text-gray-900">
                {initials || "👤"}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {user.name || "Name not provided"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">GharTokri member</p>
            </div>

            <button
              type="button"
              className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-yellow-100"
            >
              Edit
            </button>
          </div>

          <div className="mt-5">
            <h2 className="truncate text-3xl font-extrabold tracking-tight text-gray-900">
              {user.name || "Name not provided"}
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              QuickBasket member
            </p>
          </div>

          <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Email address
              </p>
              <p className="mt-2 break-words text-base font-medium text-gray-900">
                {user.email || "No email provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Orders
                </p>
                <p className="mt-2 text-xl font-bold text-gray-900">24</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Joined
                </p>
                <p className="mt-2 text-xl font-bold text-gray-900">2024</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setUser(null);
                navigate("/");
              }}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Log out
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-[#f8c600] px-4 py-3 text-sm font-bold text-gray-900 transition hover:bg-[#e9b700]"
            >
              View orders
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;

