import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const verified = location.state?.verified === true;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !verified) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">
        <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify your email first</h1>
          <p className="text-gray-500 mt-2 mb-6">Complete OTP verification before changing your password.</p>
          <Link to="/forgot-password" className="font-semibold text-[#8a6900] hover:underline">
            Start password reset
          </Link>
        </section>
      </main>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const lookupResponse = await fetch(
        `https://quickbasketstore.netlify.app/users?email=${encodeURIComponent(email)}`
      );
      if (!lookupResponse.ok) {
        throw new Error("Could not find your account. Please try again.");
      }

      const users = await lookupResponse.json();
      const user = users[0];
      if (!user?.id) {
        throw new Error("Your account could not be found.");
      }

      const updateResponse = await fetch(
        `https://quickbasketstore.netlify.app/users/${encodeURIComponent(user.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (!updateResponse.ok) {
        throw new Error("Could not update your password. Please try again.");
      }

      sessionStorage.removeItem("quickbasket-password-reset");
      setSuccess("Your password has been changed. Redirecting to login...");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (requestError) {
      setError(requestError.message || "Unable to update your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-7 sm:p-8">
          <div className="w-14 h-14 rounded-full bg-yellow-50 text-2xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Create a new password</h1>
          <p className="text-gray-500 text-center mt-2 mb-7">
            Verified account: <span className="font-medium text-gray-700">{email}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100 transition"
            />

            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mt-5 mb-2">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your new password again"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-[#f8c600] focus:ring-2 focus:ring-yellow-100 transition"
            />

            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            {success && <p role="status" className="mt-4 text-sm text-green-700">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#f8c600] hover:bg-[#eab800] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition"
            >
              {loading ? "Updating password..." : "Change password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;
