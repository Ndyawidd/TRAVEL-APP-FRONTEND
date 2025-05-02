"use client";

import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 to-blue-100">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
          TripMate
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("app/login")}
            className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-full border border-blue-500 hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("app/register")}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Daftar
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center px-8 lg:px-20 py-12 gap-10">
        <div className="text-center lg:text-left max-w-xl">
          <h2 className="text-4xl font-extrabold text-gray-800 leading-snug mb-4">
            Jelajahi Dunia Bersama{" "}
            <span className="text-blue-600">TripMate</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Temukan destinasi impianmu, kelola perjalanan, dan nikmati
            pengalaman tak terlupakan dengan bantuan platform travel terbaik
            kami.
          </p>
          <button
            onClick={() => router.push("app/login")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Mulai Sekarang
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} TripMate. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
