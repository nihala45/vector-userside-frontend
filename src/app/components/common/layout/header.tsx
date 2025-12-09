"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-300 to-purple-600 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

       
        <div className="flex items-center gap-2 text-2xl font-bold text-white tracking-wide mr-100">
          <Image
            src="/vector.png"
            alt="vector-logo"
            width={100}
            height={60}
            className="rounded"
          />
         
        </div>

        {/* ✅ NAV LINKS */}
        <nav className="hidden md:flex gap-10 text-white font-medium">
          <Link href="/" className="hover:text-violet-200 transition">
            Home
          </Link>
          <Link href="/courses" className="hover:text-violet-200 transition">
            Courses
          </Link>
          <Link href="/about" className="hover:text-violet-200 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-violet-200 transition">
            Contact
          </Link>
        </nav>

        {/* ✅ AUTH BUTTONS */}
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="rounded-lg border border-white px-5 py-2 text-white hover:bg-white hover:text-violet-700 transition"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="rounded-lg bg-white px-5 py-2 font-semibold text-violet-700 hover:bg-violet-100 transition"
          >
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}
