"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterUser } from "../../apis/auth/Mutations";


const RegisterSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    phone: z
  .string()
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^\d+$/, "Only numbers allowed"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type RegisterType = z.infer<typeof RegisterSchema>;

// -------------------------------------------------

export default function RegisterPage() {
  const registerUser = useRegisterUser();

  // React Hook Form setup
  const {
  register,
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<RegisterType>({
  resolver: zodResolver(RegisterSchema),
});

const onSubmit = (formData: RegisterType) => {
  registerUser.mutate(
    {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    },
    {
      onError: (error: any) => {
  console.log("Full error object:", error);

  // CASE 1: Normal Axios error
  let backendErrors = error?.response?.data;

  // CASE 2: Interceptor already returned data
  if (!backendErrors && typeof error === "object") {
    backendErrors = error;
  }

  console.log("Backend errors:", backendErrors);

  if (backendErrors && typeof backendErrors === "object") {
    Object.entries(backendErrors).forEach(([field, message]) => {
      setError(field as keyof RegisterType, {
        type: "server",
        message: String(message),
      });
    });
  }
}

    }
  );
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
              Create Your Account
            </h2>
            <p className="mt-2 text-gray-600">
              Join us and start learning today!
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                           shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                           shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="1234567890"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

        
        {/* Password */} 
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                           shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register("confirm")}
                type="password"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                           shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirm && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold 
                       py-3.5 rounded-lg shadow-lg transform transition hover:scale-105 
                       duration-200"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
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
