"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVerifyOTP, useResendOtp } from "@/src/app/apis/auth/Mutations";
import { toast } from "sonner";

export default function OTPPage() {
  const { id } = useParams();
  const userId = id as string;
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOtp();

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Input handling
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste full OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split("");
      setOtp(arr);
      arr.forEach((d, i) => (inputRefs.current[i].value = d));
      inputRefs.current[5]?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    verifyOTP.mutate(
      { id: userId, email_otp: otpCode },
      {
        onSuccess: () => {
          toast.success("OTP Verified Successfully!");
          router.push("/auth/login");
        },
      }
    );
  };

  // RESEND OTP
  const handleResend = () => {
    resendOTP.mutate(userId, {
      onSuccess: () => {
        setCountdown(59);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/vector-login.jpeg"
          alt="OTP Verification"
          fill
          priority
          className="object-cover rounded-r-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-r-3xl" />
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-5xl font-bold">Almost There!</h1>
          <p className="text-xl mt-3 opacity-90">Check your email for the OTP</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">

          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
            Verify Your Account
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Enter the 6-digit code sent to your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
  if (el) inputRefs.current[index] = el;
}}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-bold 
                             bg-white border-2 border-gray-300 rounded-xl 
                             focus:border-purple-700 focus:ring-4 focus:ring-purple-200 
                             outline-none"
                />
              ))}
            </div>

            {/* RESEND SECTION */}
            <div className="text-center text-sm text-gray-600">
              Didn’t get the code?
              <button
                type="button"
                disabled={countdown > 0 || resendOTP.isPending}
                onClick={handleResend}
                className="ml-2 text-purple-700 font-semibold disabled:opacity-40"
              >
                {resendOTP.isPending ? "Sending..." : "Resend"}
              </button>
              <p className="text-xs mt-1">
                {countdown > 0
                  ? `Resend in 00:${String(countdown).padStart(2, "0")}`
                  : "You can resend now"}
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={verifyOTP.isPending}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold 
                         py-4 rounded-lg shadow-lg transition-all"
            >
              {verifyOTP.isPending ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm">
            <Link href="/auth/login" className="text-purple-700 font-semibold">
              Back to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
