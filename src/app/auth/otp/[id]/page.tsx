"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVerifyOTP, useResendOtp } from "@/src/app/apis/auth/Mutations";
import { toast } from "sonner";

export default function OTPPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id;
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOtp();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first field on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus(); // ← fixed syntax error here
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
    const pasted = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);

      digits.forEach((d, i) => {
        if (inputRefs.current[i]) inputRefs.current[i]!.value = d;
      });

      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    verifyOTP.mutate(
      { id: userId, email_otp: code },
      {
        onSuccess: () => {
          toast.success("Account verified successfully!");
          router.push("/auth/login");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Invalid or expired OTP");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResend = () => {
    resendOTP.mutate(userId, {
      onSuccess: () => {
        toast.success("New OTP sent!");
        setCountdown(59);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current.forEach((el) => el && (el.value = ""));
        inputRefs.current[0]?.focus();
      },
      onError: () => toast.error("Failed to resend OTP"),
    });
  };

  const formatTime = (s: number) => `00:${s.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/vector-login.jpeg"
          alt="Verify account"
          fill
          priority
          className="object-cover rounded-r-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent rounded-r-3xl" />
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="text-5xl font-bold">Almost There!</h1>
          <p className="text-xl mt-4 opacity-90">Check your email for the 6-digit code</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900">Verify Account</h2>
            <p className="mt-3 text-gray-600">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => el && (inputRefs.current[index] = el)} // Turbopack + React 19 safe
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold
                             bg-white border-2 border-gray-300 rounded-xl
                             focus:border-purple-600 focus:ring-4 focus:ring-purple-100
                             outline-none transition-all"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              Didn’t receive it?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendOTP.isPending}
                className="font-semibold text-purple-700 hover:text-purple-800 disabled:opacity-50"
              >
                {resendOTP.isPending ? "Sending..." : "Resend OTP"}
              </button>
              <p className="text-xs mt-2 text-gray-500">
                {countdown > 0 ? `Resend in ${formatTime(countdown)}` : "You can resend now"}
              </p>
            </div>

            <button
              type="submit"
              disabled={verifyOTP.isPending || otp.join("").length < 6}
              className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400
                         text-white font-semibold rounded-xl shadow-lg transition"
            >
              {verifyOTP.isPending ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm">
            <Link href="/auth/login" className="text-purple-700 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}