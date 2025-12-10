"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/src/app/store/AuthStore";
import { useLogoutUser } from "@/src/app/apis/auth/Mutations";

export default function Header() {
  const { admin, access, clearAdminData, refresh } = useAuthStore();

  const { mutate: logoutUser, status } = useLogoutUser();

  const isAuthenticated = !!access;
  const isLoggingOut = status === "pending"; 

  
  const handleLogout = () => {
    if (!refresh) {
      clearAdminData();
      return;
    }

    logoutUser(refresh, {
      onSuccess: () => {
        clearAdminData();
      },
      onError: () => {
        clearAdminData();
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-300 to-purple-600 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ✅ LOGO */}
        <div className="flex items-center gap-2 text-2xl font-bold text-white tracking-wide">
          <Link href="/">
            <Image
              src="/vector.png"
              alt="vector-logo"
              width={100}
              height={60}
              className="rounded cursor-pointer"
            />
          </Link>
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

        {/* ✅ AUTH AREA */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              {/* ✅ LOGIN */}
              <Link
                href="/auth/login"
                className="rounded-lg border border-white px-5 py-2 text-white hover:bg-white hover:text-violet-700 transition"
              >
                Login
              </Link>

              {/* ✅ REGISTER */}
              <Link
                href="/auth/register"
                className="rounded-lg bg-white px-5 py-2 font-semibold text-violet-700 hover:bg-violet-100 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* ✅ PROFILE ICON ONLY */}
              <Link
                href="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-violet-700 font-bold hover:bg-violet-100 transition"
                title={admin?.username || "Profile"}
              >
                {admin?.username?.charAt(0)?.toUpperCase() || "U"}
              </Link>

              {/* ✅ LOGOUT (TYPE-SAFE) */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg border border-white px-5 py-2 text-white hover:bg-white hover:text-violet-700 transition disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
