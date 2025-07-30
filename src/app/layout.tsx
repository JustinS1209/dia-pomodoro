"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./components/Header";
import "./globals.css";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "dia-pomodoro - Focus Better, Achieve More",
//   description: "The ultimate Pomodoro timer for teams",
// };

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Header />
    {children}
  </AuthProvider>
</QueryClientProvider>      </body>
    </html>
  );
}
