"use client";

import { Toaster } from "sonner";
import QueryProvider from "./QueryProvider";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Toaster richColors position="top-center" />
      {children}
    </QueryProvider>
  );
}
