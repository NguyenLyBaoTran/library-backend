import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/graphqlApi";
import { jwtDecode } from "jwt-decode"; 

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(username, password);

      const token = result; 
      
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received");
      }

      const decoded = jwtDecode(token);
      const role = decoded.role || "user";

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      if (role === "admin") {
        window.location.href = "/admin/books";
      } else {
        window.location.href = "/books";
      }
    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-4">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-[#E2E9D1] rounded-3xl shadow-sm w-full max-w-md p-10"
        >
          <div className="mb-10 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#87A96B] mb-4">
              Digital Archive Access
            </p>
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-3">
              Login to continue to the Library System
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#87A96B] hover:bg-[#76945E] disabled:opacity-70 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:-translate-y-1"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}