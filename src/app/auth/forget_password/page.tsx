"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgetPassword } from "../../apis/auth/Mutations";

// ---------- Validation Schema ----------
const ForgetSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type ForgetType = z.infer<typeof ForgetSchema>;

// ---------- PAGE ----------
export default function ForgetPasswordPage() {
  const forgetPassword = useForgetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetType>({
    resolver: zodResolver(ForgetSchema),
  });

  const onSubmit = (data: ForgetType) => {
    forgetPassword.mutate(data.email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/vector-login.jpeg"
          alt="E-learning Illustration"
          fill
          priority
          className="object-cover rounded-r-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-r-3xl" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your registered email to receive OTP
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                           shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold 
                         py-3.5 rounded-lg shadow-lg transform transition hover:scale-105 
                         duration-200"
              disabled={forgetPassword.isPending}
            >
              {forgetPassword.isPending ? "Sending..." : "Send OTP"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-purple-700 hover:text-purple-600 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
