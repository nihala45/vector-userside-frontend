"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/vector-login.jpeg"
          alt="Welcome back illustration"
          fill
          priority
          className="object-cover rounded-r-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-r-3xl" />
        
        {/* Optional welcome text overlay */}
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="text-xl mt-2 opacity-90">Log in to continue learning</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo or small illustration on mobile */}
          <div className="lg:hidden mb-10 text-center">
            <Image
              src="/vector-login.jpeg"
              alt="Login illustration"
              width={280}
              height={180}
              className="mx-auto rounded-xl shadow-lg"
            />
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Sign In to Your Account
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your courses
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                         transition duration-200 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/auth/forget_password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent 
                         transition duration-200"
                placeholder="••••••••"
              />
            </div>

            {/* Remember me + checkbox (optional) */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold 
                       py-3.5 rounded-lg shadow-lg transform transition hover:scale-105 
                       duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-purple-700 hover:text-purple-600 hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}