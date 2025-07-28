"use client";
import { useEffect } from "react";

type TimerProps = {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
};

export const Timer = ({
  currentTime,
  setCurrentTime,
  isRunning,
}: TimerProps) => {
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
  );
};
