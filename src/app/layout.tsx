import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./components/landing/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dia-pomodoro - Kranker Timer, Cüs",
  description: "The ultimate Pomodoro timer for teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
