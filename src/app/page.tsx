"use client";

import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Header */}
      <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
        Explore the world with ease
      </span>

      {/* Main Title */}
      <h1 className="text-5xl font-bold text-gray-800 text-center">
        Welcome to <span className="text-blue-600">TripMate</span>
      </h1>

      {/* Quote */}
      <p className="text-gray-600 text-lg text-center mt-4 w-full px-8">
        "Traveling—it leaves you speechless, then turns you into a storyteller."
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 flex space-x-4">
        <Link href="/get-started">
          <span className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium cursor-pointer hover:bg-blue-700">
            Login
          </span>
        </Link>
        <Link href="/learn-more">
          <span className="border border-gray-700 text-gray-700 px-6 py-3 rounded-lg text-lg font-medium cursor-pointer hover:bg-gray-100">
            Sign up
          </span>
        </Link>
      </div>

      {/* Footer Info */}
      <p className="text-gray-500 text-sm mt-4">Start your journey today.</p>
    </div>
  );
};

export default LandingPage;
