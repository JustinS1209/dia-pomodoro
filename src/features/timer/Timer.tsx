"use client";
import { useEffect } from "react";

type SessionType = "work" | "shortBreak" | "longBreak";

type TimerProps = {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  initialTime: number;
  sessionType: SessionType;
};

export const Timer = ({
  currentTime,
  setCurrentTime,
  isRunning,
  initialTime,
  sessionType,
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case "work":
        return "text-red-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-purple-500";
    }
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress =
    initialTime > 0 && !isNaN(initialTime) && !isNaN(currentTime)
      ? ((initialTime - currentTime) / initialTime) * circumference
      : 0;

  return (
    <div className="relative w-80 h-80 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={`${getSessionColor()} transition-all duration-1000 ease-linear`}
          strokeLinecap="round"
        />
      </svg>

      {/* Timer display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};
