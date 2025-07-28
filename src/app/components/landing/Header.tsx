"use client";
import React, { useEffect, useState } from "react";
import { Menu, Timer, X } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
    >
      <div className="mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <Timer className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            dia-pomodoro
          </span>
        </div>
      </div>
    </header>
  );
};
