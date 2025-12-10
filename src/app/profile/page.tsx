"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/app/store/AuthStore";

export default function ProfilePage() {
  const router = useRouter();
  const { admin, access, clearAdminData } = useAuthStore();

  
  if (!access) {
    router.push("/auth/login");
    return null;
  }

  const handleLogout = () => {
    clearAdminData();
    router.push("/auth/login");
  };

  return (
    <section className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-3xl font-bold">
            {admin?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* ✅ TITLE */}
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">
          My Profile
        </h2>

        {/* ✅ USER DETAILS */}
        <div className="space-y-4 text-sm text-zinc-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-zinc-500">Username</span>
            <span>{admin?.username || "-"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-zinc-500">Email</span>
            <span>{admin?.email || "-"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-zinc-500">Role</span>
            <span>
              {admin?.is_superuser ? "Administrator" : "User"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg bg-violet-600 py-3 text-white font-semibold hover:bg-violet-700 transition"
          >
            Go to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-violet-600 py-3 text-violet-700 font-semibold hover:bg-violet-50 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </section>
  );
}
