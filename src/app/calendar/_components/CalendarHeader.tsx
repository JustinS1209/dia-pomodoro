import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap, Clock, Trash2 } from "lucide-react";
import { SharedSessionButton } from "./SharedSessionButton";

interface CalendarHeaderProps {
  currentTime: Date;
  isGenerating: boolean;
  onGenerateSessions: () => void;
  onClearSessions: () => void;
  freeSlots: string[];
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentTime,
  isGenerating,
  onGenerateSessions,
  onClearSessions,
  freeSlots,
}) => {
  const getCurrentDate = (): string => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentTimeString = (): string => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Calendar Integration
          </h1>
          <p className="text-lg text-gray-600">
            {getCurrentDate()} • {getCurrentTimeString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* 👈 Add the SharedSessionButton here */}
          <SharedSessionButton />

          {/* Clear Sessions Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onClearSessions}
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>

          {/* AI Generate Button */}
          <div className="relative">
            <Button
              size="lg"
              onClick={onGenerateSessions}
              disabled={isGenerating || freeSlots.length === 0}
              className={`
                group relative overflow-hidden transition-all duration-300 transform hover:scale-105
                bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                hover:from-purple-600 hover:to-pink-600 shadow-lg
                ${isGenerating ? "animate-pulse" : "hover:shadow-2xl"}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Sparkle animation overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div
                  className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-3 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="relative z-10 flex items-center space-x-2">
                {isGenerating ? (
                  <>
                    <Brain className="h-5 w-5 animate-spin" />
                    <span>Analyzing Calendar...</span>
                  </>
                ) : freeSlots.length === 0 ? (
                  <>
                    <Clock className="h-5 w-5" />
                    <span>Calendar Full</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span>Generate {freeSlots.length} Focus Sessions</span>
                    <Zap className="h-4 w-4" />
                  </>
                )}
              </div>
            </Button>

            {/* Free slots indicator */}
            {!isGenerating && freeSlots.length > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 bg-green-500 text-white animate-bounce"
              >
                {freeSlots.length}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
