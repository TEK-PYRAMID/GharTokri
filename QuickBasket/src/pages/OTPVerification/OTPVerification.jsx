
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const isPasswordReset = location.state?.purpose === "password-reset";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    if (isPasswordReset) {
      try {
        const challenge = JSON.parse(
          sessionStorage.getItem("quickbasket-password-reset") || "null"
        );
        if (challenge?.email === email && /^\d{6}$/.test(challenge.otp)) {
          setGeneratedOtp(challenge.otp);
          return;
        }
      } catch {
        setError("Your verification request is invalid. Please start again.");
        return;
      }
      setError("Your verification request has expired. Please start again.");
      return;
    }

    setGeneratedOtp(String(Math.floor(100000 + Math.random() * 900000)));
  }, [email, isPasswordReset]);

  const handleOTPChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!generatedOtp) {
      setError("No active OTP was found. Please request a new one.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (otp === generatedOtp) {
        setSuccess("OTP verified successfully!");
        if (isPasswordReset) {
          sessionStorage.removeItem("quickbasket-password-reset");
          setTimeout(() => {
            navigate("/reset-password", {
              state: { email, verified: true },
            });
          }, 700);
        } else {
          setTimeout(() => navigate("/login"), 1500);
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }

      setLoading(false);
    }, 1000);
  };

  const handleResendOTP = () => {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newOtp);
    if (isPasswordReset) {
      sessionStorage.setItem(
        "quickbasket-password-reset",
        JSON.stringify({ email, otp: newOtp })
      );
    }
    setOtp("");
    setError("");
    setSuccess("New OTP sent successfully.");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-7 sm:p-8">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-yellow-50 text-2xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit verification code for
          </p>
          {email && <p className="text-gray-800 font-semibold mt-1">{email}</p>}
        </div>

        <form onSubmit={handleVerifyOTP}>
          <label htmlFor="otp-code" className="block text-sm font-semibold text-gray-700 mb-2">
            Verification code
          </label>
          <input
            id="otp-code"
            type="text"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="6-digit OTP"
            aria-invalid={Boolean(error)}
            className="w-full border border-gray-300 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {generatedOtp && (
            <p className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-gray-700">
              Demo verification code: <strong className="tracking-widest">{generatedOtp}</strong>
              <span className="block mt-1 text-xs text-gray-500">
                Email delivery is not configured in this demo.
              </span>
            </p>
          )}

          {error && (
            <p role="alert" className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-lg text-black font-bold transition ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-[#f8c600] hover:bg-[#eab800]"
            }`}
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm mb-2">Didn't receive a code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-sm text-[#8a6900] font-semibold hover:underline"
          >
            Resend code
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate(isPasswordReset ? "/forgot-password" : -1)}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
      </div>
    </main>
  );
};

export default OTPVerification;
