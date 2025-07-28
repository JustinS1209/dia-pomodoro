"use client";
import { useState } from "react";
import { Play, Target, Users, Zap } from "lucide-react";
import { Timer } from "@/app/components/Timer";

export const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

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

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 animate-float">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Timer
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                  />
                </div>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-full hover:from-red-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <Play
                    className={`h-5 w-5 ${isRunning ? "animate-pulse" : ""}`}
                  />
                  <span>{isRunning ? "Pause" : "Start"} Focus</span>
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 animate-bounce-slow">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full p-4 animate-pulse">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
