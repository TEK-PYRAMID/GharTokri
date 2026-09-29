import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage:
          user.profileImage || user.image || user.avatar || user.photoURL || "",
      });
    }
  }, [user]);

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
    formData.profileImage ||
    user.profileImage ||
    user.image ||
    user.avatar ||
    user.photoURL;

  const initials = (formData.name || user.name || "User")
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEdit = () => {
    setFeedback({ type: "", text: "" });
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      profileImage:
        user.profileImage || user.image || user.avatar || user.photoURL || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFeedback({ type: "", text: "" });
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      profileImage:
        user.profileImage || user.image || user.avatar || user.photoURL || "",
    });
    setIsEditing(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setFeedback({ type: "error", text: "Name cannot be empty." });
      return;
    }

    if (!trimmedEmail) {
      setFeedback({ type: "error", text: "Email cannot be empty." });
      return;
    }

    setSaving(true);

    const updatedData = {
      name: trimmedName,
      email: trimmedEmail,
      phone: formData.phone.trim(),
      profileImage: formData.profileImage.trim(),
    };

    try {
      if (user.id) {
        await apiClient.patch(`/users/${user.id}`, updatedData);
      }

      const mergedUser = {
        ...user,
        ...updatedData,
      };

      setUser(mergedUser);
      setFeedback({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile on server:", err);
      // Even if server request fails, update local session gracefully
      const mergedUser = {
        ...user,
        ...updatedData,
      };
      setUser(mergedUser);
      setFeedback({
        type: "success",
        text: "Profile updated in your current session!",
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[60vh] bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md">
        <div className="h-2 bg-[#f8c600]" />
        <div className="p-8">
          {/* Feedback banner */}
          {feedback.text && (
            <div
              className={`mb-5 rounded-lg px-4 py-3 text-sm font-medium ${
                feedback.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {isEditing ? (
            /* Edit Mode Form */
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  ✕ Cancel
                </button>
              </div>

              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-yellow-400"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fff4bf] text-xl font-bold text-gray-900 ring-2 ring-yellow-400">
                    {initials || "👤"}
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="profileImage"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                  >
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    id="profileImage"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#f8c600] px-4 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-[#e9b700] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              <div className="flex items-center gap-5">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name ? `${user.name}'s profile` : "Profile"}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-yellow-400"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fff4bf] text-xl font-bold text-gray-900 ring-2 ring-yellow-400">
                    {initials || "👤"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {user.name || "Name not provided"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">QuickBasket member</p>
                </div>

                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="rounded-full border border-yellow-300 bg-yellow-50 px-4 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-yellow-100 flex items-center gap-1.5 shadow-sm"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
              </div>

              <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Email address
                  </p>
                  <p className="mt-1.5 break-words text-base font-medium text-gray-900">
                    {user.email || "No email provided"}
                  </p>
                </div>

                {user.phone && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Phone number
                    </p>
                    <p className="mt-1.5 break-words text-base font-medium text-gray-900">
                      {user.phone}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition hover:ring-yellow-400"
                  >
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
                  onClick={() => navigate("/orders")}
                  className="flex-1 rounded-xl bg-[#f8c600] px-4 py-3 text-sm font-bold text-gray-900 transition hover:bg-[#e9b700]"
                >
                  View orders
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;

