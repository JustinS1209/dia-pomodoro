import React from "react";
import { Timer, Sparkles, Clock, Brain } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center space-y-8 p-8">
        {/* Logo Section */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Timer
                className="h-12 w-12 text-white animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping">
              <Sparkles className="h-4 w-4 text-white absolute top-1 left-1" />
            </div>
            <div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            >
              <Clock className="h-4 w-4 text-white absolute top-1 left-1" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent animate-fade-in">
            dia-pomodoro
          </h1>
        </div>

        {/* Loading Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800 animate-fade-in-delayed">
              Setting up your workspace
            </h2>
            <p className="text-gray-600 max-w-md mx-auto animate-fade-in-delayed-2">
              We're preparing your personalized Pomodoro experience and
              connecting to your calendar
            </p>
          </div>

          {/* Loading Bar */}
          <div className="max-w-xs mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-600 rounded-full animate-loading-bar"></div>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3 max-w-sm mx-auto text-left">
            <div className="flex items-center space-x-3 animate-fade-in-step-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-step-1-pulse"></div>
              <span className="text-sm text-gray-600">Authenticating user</span>
              <div className="ml-auto opacity-0 animate-check-1">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-step-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-step-2-pulse"></div>
              <span className="text-sm text-gray-600">
                Connecting to Microsoft Graph
              </span>
              <div className="ml-auto opacity-0 animate-check-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-step-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-step-3-pulse"></div>
              <span className="text-sm text-gray-600">
                Loading calendar data
              </span>
              <div className="ml-auto opacity-0 animate-check-3">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-step-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-step-4-pulse"></div>
              <span className="text-sm text-gray-600">
                Preparing AI features
              </span>
              <div className="ml-auto opacity-0 animate-check-4">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delayed {
          0%,
          5% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delayed-2 {
          0%,
          10% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 95%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-step-1 {
          0%,
          10% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-step-2 {
          0%,
          20% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-step-3 {
          0%,
          30% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-step-4 {
          0%,
          40% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out;
        }

        .animate-fade-in-delayed-2 {
          animation: fade-in-delayed-2 1s ease-out;
        }

        .animate-loading-bar {
          animation: loading-bar 2.2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-step-1 {
          animation: fade-in-step-1 1.5s ease-out;
        }

        .animate-fade-in-step-2 {
          animation: fade-in-step-2 1.5s ease-out;
        }

        .animate-fade-in-step-3 {
          animation: fade-in-step-3 1.5s ease-out;
        }

        .animate-fade-in-step-4 {
          animation: fade-in-step-4 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
