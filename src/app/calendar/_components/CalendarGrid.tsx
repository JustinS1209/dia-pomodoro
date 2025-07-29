import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Timer,
  CheckCircle,
  X,
} from "lucide-react";
import { CalendarEvent, PomodoroSession } from "@/app/calendar/types/calendar";
import { timeSlots } from "@/lib/calendar-data";

interface CalendarGridProps {
  events: CalendarEvent[];
  pomodoroSessions: PomodoroSession[];
  currentTime: Date;
  freeSlots: string[];
  onClearSession: (sessionId: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  pomodoroSessions,
  currentTime,
  freeSlots,
  onClearSession,
}) => {
  const isCurrentTime = (timeSlot: string): boolean => {
    const currentHour = currentTime.getHours();
    const slotHour = parseInt(timeSlot.split(":")[0]);
    return currentHour === slotHour;
  };

  const getEventStyle = (event: CalendarEvent | PomodoroSession) => {
    const startHour = parseInt(event.time.split(":")[0]);
    const top = (startHour - 8) * 120 + 60;
    const height = Math.max((event.duration / 60) * 120, 80);
    return {
      top: `${top}px`,
      height: `${height}px`,
      left: "80px",
      right: "20px",
    };
  };

  return (
    <Card className="relative overflow-hidden shadow-2xl">
      <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Today's Schedule
            </h2>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {events.length} meetings • {pomodoroSessions.length} focus sessions
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative" style={{ height: "1440px" }}>
          {/* Time Grid */}
          <div className="absolute inset-0">
            {timeSlots.map((timeSlot, index) => {
              const isFree = freeSlots.includes(timeSlot);
              const isCurrent = isCurrentTime(timeSlot);

              return (
                <div
                  key={timeSlot}
                  className={`absolute left-0 right-0 border-b border-gray-100 transition-all duration-200 ${
                    isCurrent
                      ? "bg-blue-50 border-blue-200"
                      : isFree
                        ? "bg-green-50/30 hover:bg-green-50/50"
                        : "bg-gray-50/30"
                  }`}
                  style={{
                    top: `${index * 120}px`,
                    height: "120px",
                  }}
                >
                  {/* Time Label */}
                  <div
                    className={`absolute left-4 top-2 text-sm font-medium transition-colors duration-200 ${
                      isCurrent ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {timeSlot}
                  </div>

                  {/* Free Slot Indicator */}
                  {isFree && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}

                  {/* Current Time Indicator */}
                  {isCurrent && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  )}

                  {/* Free Slot Label */}
                  {isFree && (
                    <Badge
                      variant="secondary"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-600 border-green-200"
                    >
                      Available
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          {/* Calendar Events */}
          {events.map((event) => (
            <div
              key={event.id}
              className={`absolute rounded-lg shadow-lg border-l-4 p-2 ${event.color} text-white transition-all duration-300 hover:shadow-xl overflow-hidden`}
              style={getEventStyle(event)}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm leading-tight pr-2 flex-1 overflow-hidden">
                  <span className="block truncate">{event.title}</span>
                </h3>
                <Clock className="h-4 w-4 opacity-75 flex-shrink-0" />
              </div>

              <div className="space-y-1 text-xs opacity-90">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {event.time} ({event.duration}min)
                  </span>
                </div>

                {event.attendees && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {event.attendees} attendees
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center space-x-2">
                    {event.location.includes("Zoom") ||
                    event.location.includes("Teams") ? (
                      <Video className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Pomodoro Sessions */}
          {pomodoroSessions.map((session) => (
            <div
              key={session.id}
              className="absolute rounded-lg shadow-lg border-l-4 border-red-600 bg-red-500 text-white p-3 transition-all duration-300 hover:shadow-xl overflow-hidden group"
              style={getEventStyle(session)}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
                  <Timer className="h-4 w-4 flex-shrink-0" />
                  <h3 className="font-semibold text-sm overflow-hidden">
                    <span className="block truncate">{session.title}</span>
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearSession(session.id)}
                  className="opacity-75 hover:opacity-100 transition-opacity duration-200 flex-shrink-0 h-auto hover:bg-red-600/20 z-10 relative"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 text-xs opacity-90">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {session.time} ({session.duration} min)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Deep Focus Mode</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
