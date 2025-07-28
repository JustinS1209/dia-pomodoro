"use client";
import { Users } from "lucide-react";
import { PomodoroTimer } from "@/app/components/PomodoroTimer";

export const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Kranker Timer,
                <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Cüs
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                The ultimate Pomodoro timer for teams. Sync your focus sessions,
                integrate with calendars, and boost productivity together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-red-500 hover:text-red-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Try Team/Calendar Synchronization Mode</span>
              </button>
            </div>
          </div>

          <PomodoroTimer />
        </div>
      </div>
    </section>
  );
};
