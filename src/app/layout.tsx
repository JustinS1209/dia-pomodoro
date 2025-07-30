"use client";

import { Inter } from "next/font/google";
import { Header } from "./components/Header";
import "./globals.css";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>DIA Pomodoro</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
