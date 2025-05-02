"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login gagal");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "ADMIN") {
        router.push("/app/admin");
      } else if (data.user.role === "USER") {
        router.push("/app/user/home");
      } else {
        throw new Error("Role tidak dikenali");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err.message || "Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Selamat Datang 👋
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Belum punya akun?{" "}
          <span
            onClick={() => router.push("register")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Daftar di sini
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
