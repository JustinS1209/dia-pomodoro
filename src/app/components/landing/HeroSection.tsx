"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Play, Target, Users, Zap } from "lucide-react";

export const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(currentTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Focus Better,
                <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Achieve More
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                The ultimate Pomodoro timer for teams. Sync your focus sessions,
                integrate with calendars, and boost productivity together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Play className="h-5 w-5 group-hover:animate-pulse" />
                <span>Start Focusing Now</span>
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-red-500 hover:text-red-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Try Team Mode</span>
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 animate-float">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto rounded-full border-8 border-red-100 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-full transition-all duration-1000"
                      style={{
                        background: `conic-gradient(from 0deg, #ef4444 ${((1500 - currentTime) / 1500) * 360}deg, #fecaca ${((1500 - currentTime) / 1500) * 360}deg)`,
                      }}
                    ></div>
                    <div className="relative z-10 bg-white w-52 h-52 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-mono font-bold text-gray-800">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                  </div>
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
