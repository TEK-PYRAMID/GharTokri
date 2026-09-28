import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(normalizedEmail)}`
      );

      if (!response.ok) {
        throw new Error("Could not check the email address. Please try again.");
      }

      const users = await response.json();
      if (!users.length) {
        setError("No account was found with that email address.");
        return;
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      sessionStorage.setItem(
        "quickbasket-password-reset",
        JSON.stringify({ email: normalizedEmail, otp })
      );
      navigate("/otp-verification", {
        state: { email: normalizedEmail, purpose: "password-reset" },
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-3" aria-label="QuickBasket home">
            <span className="w-12 h-12 rounded-xl bg-[#f8c600] flex items-center justify-center shadow-md text-xl font-black text-[#111111]">
              QB
            </span>
            <span>
              <span className="block text-2xl font-extrabold text-[#111111]">QuickBasket</span>
              <span className="block text-sm text-gray-500">Groceries delivered quickly</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-7 sm:p-8">
          <div className="w-14 h-14 rounded-full bg-yellow-50 text-2xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Forgot your password?</h1>
          <p className="text-gray-500 text-center mt-2 mb-7">
            Enter the email linked to your account. We’ll verify it before you can set a new password.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100 transition"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "reset-email-error" : undefined}
            />

            {error && (
              <p id="reset-email-error" role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#f8c600] hover:bg-[#eab800] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition duration-200 shadow-sm"
            >
              {loading ? "Checking account..." : "Continue to verification"}
            </button>
          </form>

          <p className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-600 hover:text-[#a17a00] font-semibold">
              ← Back to login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
