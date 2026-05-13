import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/graphqlApi";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(username, email, password);
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(error.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-4">
        <form
          onSubmit={handleRegister}
          className="bg-white border border-[#E2E9D1] rounded-3xl shadow-sm w-full max-w-md p-10"
        >
          <div className="mb-10 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#87A96B] mb-4">
              Join the Archive
            </p>
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3">
              Fill in your details to start borrowing
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border border-[#DDE5CF] bg-[#FDFEFB] p-4 rounded-2xl outline-none focus:border-[#87A96B] transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-[#DDE5CF] bg-[#FDFEFB] p-4 rounded-2xl outline-none focus:border-[#87A96B] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-[#DDE5CF] bg-[#FDFEFB] p-4 rounded-2xl outline-none focus:border-[#87A96B] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-[#EEF4E8] border border-[#87A96B] text-[#87A96B] text-sm rounded-xl px-4 py-3">
              Registration successful! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 bg-[#87A96B] hover:bg-[#76945E] disabled:opacity-70 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:-translate-y-1"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#87A96B] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}