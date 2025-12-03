"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/vector-login.jpeg"
          alt="Learning Illustration"
          fill
          priority
          className="object-cover rounded-r-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-r-3xl" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 lg:px-12">
        <div className="w-full max-w-lg text-center lg:text-left">

          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-purple-700">Vector Learning</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Start your journey with high-quality learning materials, accessible anytime.
          </p>

          {/* Buttons */}
          <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
            
            <Link
              href="/auth/login"
              className="block w-full sm:w-auto bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="block w-full sm:w-auto border border-purple-700 text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition"
            >
              Create Account
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
