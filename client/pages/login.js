import { useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";

import { loginUser } from "../services/graphqlApi";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await loginUser(
        username,
        password
      );

      localStorage.setItem(
        "token",
        token
      );

      alert("Login successful!");

      router.push("/graphql-demo");
    } catch (error) {
      console.log(error);

      alert("Login failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="border p-8 rounded-xl shadow-md w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Login
          </h1>

          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded mb-4"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-4"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}