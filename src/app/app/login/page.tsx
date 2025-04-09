"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Tidak perlu validasi - langsung redirect ke halaman admin
    router.push("/app/admin");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login Admin
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
