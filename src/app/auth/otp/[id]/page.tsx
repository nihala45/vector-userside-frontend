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

  // This is the ONLY way that works with Next.js 16 + Turbopack + React 19
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOtp();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
          toast.success("Verified successfully!");
          router.push("/");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Invalid OTP");
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
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/vector-login.jpeg"
          alt="Verification"
          fill
          priority
          className="object-cover rounded-r-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent rounded-r-3xl" />
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-5xl font-bold">Almost There!</h1>
          <p className="text-xl mt-4">Check your email for the code</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center mb-8">Verify Account</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((_, index) => (
                <input
                  key={index}
                  // THIS IS THE ONLY REF PATTERN THAT WORKS IN NEXT.JS 16 + TURBOPACK
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-100"
                />
              ))}
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendOTP.isPending}
                className="text-purple-700 font-medium disabled:opacity-50"
              >
                {resendOTP.isPending ? "Sending..." : "Resend OTP"}
              </button>
              <p className="text-gray-500 mt-1">
                {countdown > 0 ? `Resend in 00:${countdown.toString().padStart(2, "0")}` : "Can resend now"}
              </p>
            </div>

            <button
              type="submit"
              disabled={verifyOTP.isPending}
              className="w-full py-4 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 disabled:opacity-70"
            >
              {verifyOTP.isPending ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="mt-8 text-center">
            <Link href="/auth/login" className="text-purple-700">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}