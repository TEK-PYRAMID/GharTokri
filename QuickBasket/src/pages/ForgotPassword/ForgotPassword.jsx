import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // Backend API will come here later

    navigate("/verify-otp", {
      state: {
        email: email,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-7">

        {/* Heading */}
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          Forgot Password
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-center mt-2 mb-6">
          Enter your registered email
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-5">

            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none
                         focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100
                         transition"
            />

          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            className="w-full bg-[#f8c600] hover:bg-[#eab800]
                       text-black font-bold py-3 rounded-lg
                       transition duration-200 shadow-sm"
          >
            Send OTP
          </button>

        </form>

        {/* Back to Login */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-[#f8c600]
                       font-semibold hover:underline"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;