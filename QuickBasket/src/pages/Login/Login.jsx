
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `http://localhost:3000/users?email=${encodeURIComponent(values.email)}`
        );
        const users = await response.json();

        if (!users || users.length === 0) {
          alert("Email is not registered");
          return;
        }

        const user = users[0];

        if (user.password !== values.password) {
          alert("Incorrect password");
          return;
        }

        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage:
            user.profileImage || user.image || user.avatar || user.photoURL || "",
        });

        alert("Login successful!");

        // Navigate to home page after login
        navigate("/");

      } catch (error) {
        console.log(error);
        alert("Login failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">

            <div className="w-12 h-12 rounded-xl bg-[#f8c600] flex items-center justify-center shadow-md">
              <span className="text-2xl font-black text-[#111111]">
                QB
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#111111]">
                QuickBasket
              </h1>

              <p className="text-sm text-gray-500">
                Groceries delivered quickly
              </p>
            </div>

          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-7">

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Login to continue shopping
          </p>

          <form onSubmit={formik.handleSubmit}>

            {/* Email */}
            <div className="mb-4">

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                  ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100"
                  }`}
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}

            </div>

            {/* Password */}
            <div className="mb-6">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                  ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100"
                  }`}
              />
{/* 
             
            </div> */}
          {formik.touched.password && formik.errors.password && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.password}
  </p>
)}

</div>

{/* Forgot Password */}
<div className="text-right mb-6">
  <Link
    to="/forgot-password"
    className="text-sm text-gray-700 font-semibold hover:text-[#f8c600] hover:underline"
  >
    Forgot Password?
  </Link>
</div>




            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#f8c600] hover:bg-[#eab800] text-black font-bold py-3 rounded-lg transition duration-200 shadow-sm"
            >
              Login
            </button>

          </form>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?

            <Link
              to="/signup"
              className="text-gray-900 font-semibold ml-1 hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Fast • Fresh • Convenient
        </p>

      </div>
    </div>
  );
}

export default Login;


