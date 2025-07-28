import { useState } from "react";
import { Timer } from "@/app/components/Timer";
import { Play } from "lucide-react";

export const PomodoroTimer = () => {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);

  return (
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
          <Play className={`h-5 w-5 ${isRunning ? "animate-pulse" : ""}`} />
          <span>{isRunning ? "Pause" : "Start"} Focus</span>
        </button>
      </div>
    </div>
  );
};
