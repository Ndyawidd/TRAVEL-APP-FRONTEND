"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo TripMate */}
        <Link href="/">
          <div className="text-2xl font-bold text-gray-800">TripMate</div>
        </Link>

        {/* Login & Sign Up */}
        <div className="flex space-x-4">
          <Link href="/app/login">
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
              Login
            </span>
          </Link>
          <Link href="/app/register">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
