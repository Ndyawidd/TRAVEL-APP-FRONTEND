"use client";

import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      {/* Header */}
      <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
        Explore the world with ease
      </span>

      {/* Title */}
      <h1 className="text-5xl font-bold text-center text-gray-800">
        Welcome to <span className="text-blue-600">TripMate</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg text-center mt-4 max-w-2xl">
        Discover amazing destinations, book your trips, and create unforgettable stories with us.
      </p>

      {/* CTA */}
      <div className="mt-6 flex space-x-4">
        <Link href="/app/login">
          <span className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 cursor-pointer">
            Login as Admin
          </span>
        </Link>
        <Link href="/#features">
          <span className="border border-gray-700 text-gray-700 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 cursor-pointer">
            Learn More
          </span>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-6">Start your journey today 🚀</p>
    </div>
  );
};

export default LandingPage;
