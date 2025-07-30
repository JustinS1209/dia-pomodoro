import { useState, useEffect, useRef } from "react";
import { Timer } from "@/features/timer/Timer";
import {
  Play,
  Pause,
  Clock,
  Coffee,
  Moon,
  Users,
  PictureInPicture,
} from "lucide-react";
import { playNotificationSound } from "@/features/timer/utils/notificationSound"

type SessionType = "work" | "shortBreak" | "longBreak";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const PomodoroTimer = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [shortBreaksBeforeLong, setShortBreaksBeforeLong] = useState(4);

  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [sessionCount, setSessionCount] = useState(0);

  const [isInPiP, setIsInPiP] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update current time when durations change
  useEffect(() => {
    switch (sessionType) {
      case "work":
        setCurrentTime(workDuration * 60);
        break;
      case "shortBreak":
        setCurrentTime(shortBreakDuration * 60);
        break;
      case "longBreak":
        setCurrentTime(longBreakDuration * 60);
        break;
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionType]);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      // Background
      ctx.fillStyle = "#ffffff"; // white background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Progress Circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const progress = currentTime / getInitialTime();

      ctx.strokeStyle = "#e2e8f0"; // Gray
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      const sessionColor = getSessionColor();
      ctx.strokeStyle = sessionColor.startsWith("from-red")
        ? "#f56565"
        : sessionColor.startsWith("from-green")
          ? "#48bb78"
          : "#a0aec0";
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        -0.5 * Math.PI,
        2 * Math.PI * progress - 0.5 * Math.PI,
      );
      ctx.stroke();

      // Time text
      ctx.fillStyle = "black";
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(formatTime(currentTime), centerX, centerY);
    };

    draw();
  }, [currentTime]);

  // Handle session completion
  useEffect(() => {
    if (currentTime <= 0 && isRunning) {
      playNotificationSound();
      if (sessionType === "work") {
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);

        // After configured number of work sessions, take a long break
        if (newSessionCount % shortBreaksBeforeLong === 0) {
          setSessionType("longBreak");
          setCurrentTime(longBreakDuration * 60);
        } else {
          setSessionType("shortBreak");
          setCurrentTime(shortBreakDuration * 60);
        }
      } else {
        // After any break, go back to work
        setSessionType("work");
        setCurrentTime(workDuration * 60);
      }
    }
  }, [
    currentTime,
    sessionType,
    sessionCount,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    shortBreaksBeforeLong,
  ]);

  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsInPiP(false);
    } else {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const stream = canvas.captureStream();
      video.srcObject = stream;
      await video.play();
      await video.requestPictureInPicture();
      setIsInPiP(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLeavePiP = () => setIsInPiP(false);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);
    return () =>
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
  }, []);

  const getSessionLabel = () => {
    switch (sessionType) {
      case "work":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case "work":
        return "from-red-500 to-orange-600";
      case "shortBreak":
        return "from-green-500 to-blue-600";
      case "longBreak":
        return "from-purple-500 to-pink-600";
    }
  };

  const getInitialTime = () => {
    switch (sessionType) {
      case "work":
        return workDuration * 60;
      case "shortBreak":
        return shortBreakDuration * 60;
      case "longBreak":
        return longBreakDuration * 60;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <div className="text-center space-y-6">
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {getSessionLabel()}
          </h3>
          <p className="text-sm text-gray-600">
            Session {Math.floor(sessionCount / shortBreaksBeforeLong) + 1} •
            Work Period {(sessionCount % shortBreaksBeforeLong) + 1}
          </p>
        </div>

        <div className="relative">
          <Timer
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            initialTime={getInitialTime()}
            sessionType={sessionType}
          />
        </div>

        <div className="flex flex-row w-fit mx-auto space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`bg-gradient-to-r ${getSessionColor()} text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto`}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span>
              {isRunning ? "Pause" : "Start"} {getSessionLabel()}
            </span>
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setCurrentTime(getInitialTime);
            }}
            className={`bg-gradient-to-r ${getSessionColor()} text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto`}
          >
            <span>Reset Timer</span>
          </button>
        </div>

        <button
          onClick={togglePiP}
          className={`bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto ${isInPiP ? "bg-green-200" : ""}`}
        >
          <PictureInPicture className="h-5 w-5" />
          <span>{isInPiP ? "Exit PiP" : "Enter PiP"}</span>
        </button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Timer Settings
        </h4>

        <canvas
          ref={canvasRef}
          width="400"
          height="200"
          className="hidden"
        ></canvas>
        <video ref={videoRef} muted className="hidden"></video>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-red-100 rounded-full p-2">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              <label className="text-gray-700 font-medium text-sm">
                Work Duration
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="flex-1 text-center border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isRunning}
              />
              <span className="text-sm text-gray-500 font-medium">min</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <Coffee className="h-4 w-4 text-green-600" />
              </div>
              <label className="text-gray-700 font-medium text-sm">
                Short Break
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                className="flex-1 text-center border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isRunning}
              />
              <span className="text-sm text-gray-500 font-medium">min</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Moon className="h-4 w-4 text-purple-600" />
              </div>
              <label className="text-gray-700 font-medium text-sm">
                Long Break
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                className="flex-1 text-center border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isRunning}
              />
              <span className="text-sm text-gray-500 font-medium">min</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <label className="text-gray-700 font-medium text-sm">
                Work Sessions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="2"
                max="10"
                value={shortBreaksBeforeLong}
                onChange={(e) =>
                  setShortBreaksBeforeLong(Number(e.target.value))
                }
                className="flex-1 text-center border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isRunning}
              />
              <span className="text-xs text-gray-500 font-medium">
                before long break
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
