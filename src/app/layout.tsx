"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./components/landing/Header";
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
        <Header />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
