import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";

function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        // Check if email already exists
        const response = await fetch(
          `http://localhost:3000/users?email=${encodeURIComponent(
            values.email
          )}`
        );

        const existingUsers = await response.json();

        if (existingUsers && existingUsers.length > 0) {
          alert("Email already registered");
          return;
        }

        // Create user
        const createResponse = await fetch(
          "http://localhost:3000/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!createResponse.ok) {
          throw new Error("Signup failed");
        }

        // Signup successful
        alert("Signup successful! OTP has been sent.");

        // Go to OTP verification page
        navigate("/otp-verification", {
          state: {
            email: values.email,
          },
        });

        resetForm();
      } catch (error) {
        console.log(error);
        alert("Signup failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" showTagline={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-7">

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Create your account
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Sign up to start shopping
          </p>

          <form onSubmit={formik.handleSubmit}>

            {/* Name */}
            <div className="mb-4">

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100"
                }`}
              />

              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}

            </div>

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
                className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
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
                className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100"
                }`}
              />

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}

            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-[#f8c600] hover:bg-[#eab800] text-black font-bold py-3 rounded-lg transition duration-200 shadow-sm"
            >
              Sign Up
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?

            <Link
              to="/login"
              className="text-gray-900 font-semibold ml-1 hover:underline"
            >
              Login
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

export default Signup;

