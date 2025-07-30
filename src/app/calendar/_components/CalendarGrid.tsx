// src/app/calendar/_components/CalendarGrid.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Video,
  X,
  Timer,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { CalendarEvent, PomodoroSession } from "@/app/calendar/types/calendar";
import { timeSlots } from "@/lib/calendar-data";
import { fetchCalendarEventsForToday } from "@/features/calendar/utils";
import { ntUserToUserPrincipalName } from "@/features/common/utils";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { transformGraphEventsToCalendarEvents } from "@/lib/calendar-utils";

interface CalendarGridProps {
  pomodoroSessions: PomodoroSession[];
  currentTime: Date;
  freeSlots: string[];
  onClearSession: (sessionId: number) => void;
  onEventsUpdate?: (events: CalendarEvent[], loading: boolean) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  pomodoroSessions,
  currentTime,
  freeSlots,
  onClearSession,
  onEventsUpdate,
}) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Fetch calendar events
  const fetchEvents = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Notify parent about loading state
      onEventsUpdate?.(events, true);

      const userPrincipalName = ntUserToUserPrincipalName(currentUser.userId);
      const fetchedEvents =
        await fetchCalendarEventsForToday(userPrincipalName);

      console.log("Fetched raw events:", fetchedEvents);

      // Transform API data to CalendarEvent format
      const transformedEvents =
        transformGraphEventsToCalendarEvents(fetchedEvents);

      console.log("Transformed events:", transformedEvents);
      console.log("Number of transformed events:", transformedEvents.length);

      // Additional debugging: log each raw event
      fetchedEvents.forEach((rawEvent, index) => {
        console.log(`Raw event ${index + 1}:`, {
          subject: rawEvent.subject,
          isCancelled: rawEvent.isCancelled,
          isAllDay: rawEvent.isAllDay,
          startDateTime: rawEvent.start?.dateTime,
          timeZone: rawEvent.start?.timeZone,
        });
      });

      setEvents(transformedEvents);
      setLastFetch(new Date());

      // Notify parent component about the updated events
      onEventsUpdate?.(transformedEvents, false);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendar events",
      );

      // Notify parent about error state
      onEventsUpdate?.([], false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const isCurrentTime = (timeSlot: string): boolean => {
    const currentHour = currentTime.getHours();
    const slotHour = parseInt(timeSlot.split(":")[0]);
    return currentHour === slotHour;
  };

  const getEventStyle = (event: CalendarEvent | PomodoroSession) => {
    const startHour = parseInt(event.time.split(":")[0]);
    const startMinute = parseInt(event.time.split(":")[1]) || 0;

    // Calculate precise positioning including minutes
    // Each hour slot is 120px tall, starting from 8:00
    // NO OFFSET NEEDED - the grid starts at 0px for 8:00
    const top = (startHour - 8) * 120 + (startMinute / 60) * 120;

    // Better height calculation - more proportional with smaller minimum
    // Each hour = 120px, so each minute = 2px
    const heightFromDuration = (event.duration / 60) * 120;
    const height = Math.max(heightFromDuration, 40); // Reduced minimum height from 80 to 40

    console.log(
      `Event positioning - ${event.title}: time=${event.time}, duration=${event.duration}min, hour=${startHour}, minute=${startMinute}, calculated top=${top}px, height=${height}px (from duration: ${heightFromDuration}px)`,
    );

    // Debug: Let's also calculate what time this position represents
    const calculatedTimeSlot = Math.floor(top / 120) + 8;
    const calculatedMinutes = Math.floor((top % 120) / 2);
    console.log(
      `Position ${top}px represents: ${calculatedTimeSlot}:${calculatedMinutes.toString().padStart(2, "0")}`,
    );

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: "80px",
      right: "20px",
    };
  };
  const handleRefresh = () => {
    fetchEvents();
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
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>

            {/* Event Count */}
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {loading ? (
                "Loading..."
              ) : error ? (
                <span className="text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Error</span>
                </span>
              ) : (
                `${events.length} meetings • ${pomodoroSessions.length} focus sessions`
              )}
            </div>

            {/* Last Updated */}
            {lastFetch && !loading && (
              <div className="text-xs text-gray-400">
                Updated:{" "}
                {lastFetch.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Failed to load calendar events: {error}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-red-600 hover:text-red-800"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="relative"
          style={{ height: "1440px", minHeight: "1440px" }}
        >
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
                    className={`absolute left-4 top-4 text-sm font-medium transition-colors duration-200 ${
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

          {/* Loading Overlay */}
          {loading && events.length === 0 && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600">Loading your calendar...</p>
              </div>
            </div>
          )}

          {/* Calendar Events */}
          {events.map((event) => {
            const style = getEventStyle(event);
            return (
              <div
                key={event.id}
                className={`absolute rounded-lg shadow-lg border-l-4 p-3 ${event.color} text-white transition-all duration-300 hover:shadow-xl overflow-hidden z-20`}
                style={{
                  ...style,
                  minHeight: "40px", // Ensure minimum height matches our calculation
                  minWidth: "200px", // Ensure minimum width
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm leading-tight pr-2 flex-1 min-w-0">
                    <span className="block truncate" title={event.title}>
                      {event.title}
                    </span>
                  </h3>
                  <Clock className="h-4 w-4 opacity-75 flex-shrink-0" />
                </div>

                <div className="space-y-1 text-xs opacity-90">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {event.time} ({event.duration}min)
                    </span>
                  </div>

                  {event.attendees && (
                    <div className="flex items-center space-x-2 min-w-0">
                      <Users className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {event.attendees} attendee
                        {event.attendees !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center space-x-2 min-w-0">
                      {event.location.includes("Online") ||
                      event.location.includes("Teams") ||
                      event.location.includes("Zoom") ? (
                        <Video className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate" title={event.location}>
                        {event.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pomodoro Sessions */}
          {pomodoroSessions.map((session) => (
            <div
              key={session.id}
              className="absolute rounded-lg shadow-lg border-l-4 border-red-600 bg-red-500 text-white p-2 transition-all duration-300 hover:shadow-xl overflow-hidden group z-20"
              style={getEventStyle(session)}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-1 flex-1 min-w-0 pr-1">
                  <Timer className="h-3 w-3 flex-shrink-0" />
                  <h3 className="font-medium text-xs min-w-0">
                    <span className="block truncate">{session.title}</span>
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearSession(session.id)}
                  className="opacity-75 hover:opacity-100 transition-opacity duration-200 flex-shrink-0 h-auto p-0.5 hover:bg-red-600/20 z-10 relative"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-xs opacity-90">
                <div className="flex items-center space-x-1 min-w-0">
                  <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">
                    {session.time} ({session.duration}min)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
