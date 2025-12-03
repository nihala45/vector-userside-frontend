"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVerifyOTP, useResendOtp } from "@/src/app/apis/auth/Mutations";
import { toast } from "sonner";

export default function OTPPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id as string;
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOtp();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount & after resend
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      // Allow clearing current even if empty (for better UX)
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Update all inputs visually
      digits.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      });

      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6 || otpCode.includes("")) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    verifyOTP.mutate(
      { id: userId, email_otp: otpCode },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully!");
          router.push("/auth/login");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Invalid or expired OTP");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResend = () => {
    resendOTP.mutate(userId, {
      onSuccess: () => {
        toast.success("New OTP sent to your email!");
        setCountdown(59);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current.forEach((input) => input && (input.value = ""));
        inputRefs.current[0]?.focus();
      },
      onError: () => {
        toast.error("Failed to resend OTP. Try again.");
      },
    });
  };

  const formatTime = (seconds: number) => {
    return `00:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Decorative Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/vector-login.jpeg"
          alt="Verify your account"
          fill
          priority
          className="object-cover rounded-r-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rounded-r-3xl" />
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="text-5xl font-bold leading-tight">Almost There!</h1>
          <p className="text-xl mt-4 opacity-90">We sent a 6-digit code to your email</p>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900">Verify Account</h2>
            <p className="mt-3 text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 md:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold text-gray-800
                             bg-white border-2 border-gray-300 rounded-xl
                             focus:border-purple-600 focus:ring-4 focus:ring-purple-100
                             transition-all outline-none shadow-sm"
                  aria-label={`Digit ${index + 1} of OTP`}
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || resendOTP.isPending}
                  className="font-semibold text-purple-700 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                >
                  {resendOTP.isPending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {countdown > 0
                  ? `Resend available in ${formatTime(countdown)}`
                  : "You can now request a new code"}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verifyOTP.isPending || otp.join("").length < 6}
              className="w-full py-4 px-6 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400
                         text-white font-semibold text-lg rounded-xl shadow-lg
                         transition-all duration-200 transform hover:scale-[1.02] active:scale-100"
            >
              {verifyOTP.isPending ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-600">
            <Link href="/auth/login" className="text-purple-700 font-medium hover:underline">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}