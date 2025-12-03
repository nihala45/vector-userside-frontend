/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosAdmin } from "../../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/AuthStore";

// ---- Types ----
interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminResponse {
  token: string;
  access: string;
  admin: {
    id: number;
    username: string;
    email: string;
    is_superuser: boolean;
  };
}

interface RegisterResponse {
  id: string | number;
  message: string;
}

interface VerifyOTPResponse {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  access: string;
}

// ---- Hooks ----

export function useLoginUser() {
  const setAdminData = useAuthStore((state) => state.setAdminData);
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: AdminLoginPayload) => {
      const response = await axiosAdmin.post<AdminResponse>("/api/user/login", {
        email,
        password,
      });
      return response.data;
    },

    onSuccess: (data) => {
      const { admin, access } = data;
      setAdminData(admin, access);
      toast.success("Welcome back!");
      router.push("/dashboard");
    },

    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Login failed";
      toast.error(message);
    },
  });
}

export function useRegisterUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      username: string;
      phone: string;
      password: string;
    }) => {
      const res = await axiosAdmin.post<RegisterResponse>("/api/user/register/", payload);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.msg || "Registration successful!"); 
      router.push(`/auth/otp/${data.id}`);
    },

    onError: (error: any) => {
      const data = error.response?.data;

      if (data && typeof data === "object") {
        const firstError = Object.values(data)[0];
        toast.error(String(firstError));
        return;
      }

      toast.error("Registration failed");
    },
  });
}



export function useVerifyOTP() {
  const router = useRouter();
  const setAdminData = useAuthStore((state) => state.setAdminData);

  return useMutation({
    mutationFn: async ({ id, email_otp }: { id: string | number; email_otp: string }) => {
      const res = await axiosAdmin.post(`/api/user/verify_otp/${id}/`, {
        email_otp: email_otp,
      });
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.msg )

      setAdminData(
        {
          id: data.id,
          username: data.username,
          email: data.email,
          is_superuser: data.is_superuser,
        },
        data.access
      );

      router.push("/");
    },

    onError: (error: any) => {
      const message = error.response?.data?.error || "Invalid or expired OTP";
      toast.error(message);
    },
  });
}


export function useLogoutUser() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAdminData);

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      await axiosAdmin.post("/api/user/logout/", {
        refresh: refreshToken,
      });
    },

    onSuccess: () => {
      toast.success("Logged out successfully!");
      clearAuth();
      router.push("/auth/login");
    },

    onError: () => {
      // Even if API fails, still clear local state (security!)
      toast.warning("Session cleared locally.");
      clearAuth();
      router.push("/auth/login");
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await axiosAdmin.post(`/api/user/resend_otp/${id}/`);
      return res.data;
    },

    onSuccess: () => {
      toast.success("A new OTP has been sent!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    },
  });
}








export function useForgetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosAdmin.post("/api/user/forget_password/", {
        email,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.msg || "OTP sent!");

    
      router.push(`/auth/otp/${data.id}`);
    },

    onError: (error: any) => {
      const backend = error.response?.data;

      
      if (backend && typeof backend === "object") {
        const firstError = Object.values(backend)[0];
        toast.error(String(firstError));
        return;
      }

      toast.error("Failed to send OTP");
    },
  });
}







