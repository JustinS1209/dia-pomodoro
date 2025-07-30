// src/components/calendar/CalendarComparison.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Brain,
  Sparkles,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  Zap,
} from "lucide-react";
import { GraphUser } from "@/features/user/configurations/types";
import { getNtUserByUserPrincipalName } from "@/features/user/utils";

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  duration: number;
  color: string;
}

interface UserWithCalendar {
  user: GraphUser;
  ntUser: string;
  initials: string;
  color: string;
  events: CalendarEvent[];
}

interface CalendarComparisonProps {
  selectedGraphUsers: GraphUser[];
  onCreateSession: (sessionTime: string) => void;
  onBack: () => void;
}

// Mock events for demonstration - in real app, you'd fetch from calendar API
const generateMockEvents = (userIndex: number): CalendarEvent[] => {
  const eventSets = [
    [
      {
        id: 1,
        title: "Morning Standup",
        time: "09:00",
        duration: 30,
        color: "bg-blue-500",
      },
      {
        id: 2,
        title: "Project Review",
        time: "11:00",
        duration: 60,
        color: "bg-green-500",
      },
      {
        id: 3,
        title: "Client Call",
        time: "14:30",
        duration: 45,
        color: "bg-purple-500",
      },
    ],
    [
      {
        id: 1,
        title: "Team Sync",
        time: "09:30",
        duration: 30,
        color: "bg-orange-500",
      },
      {
        id: 2,
        title: "Design Workshop",
        time: "13:00",
        duration: 90,
        color: "bg-pink-500",
      },
      {
        id: 3,
        title: "1:1 Meeting",
        time: "16:00",
        duration: 30,
        color: "bg-indigo-500",
      },
    ],
    [
      {
        id: 1,
        title: "Code Review",
        time: "10:00",
        duration: 45,
        color: "bg-teal-500",
      },
      {
        id: 2,
        title: "Sprint Planning",
        time: "15:00",
        duration: 60,
        color: "bg-cyan-500",
      },
    ],
    [
      {
        id: 1,
        title: "Architecture Discussion",
        time: "11:30",
        duration: 60,
        color: "bg-red-500",
      },
      {
        id: 2,
        title: "Demo Prep",
        time: "16:30",
        duration: 30,
        color: "bg-yellow-500",
      },
    ],
  ];

  return eventSets[userIndex % eventSets.length] || eventSets[0];
};

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export const CalendarComparison: React.FC<CalendarComparisonProps> = ({
  selectedGraphUsers,
  onCreateSession,
  onBack,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedTime, setSuggestedTime] = useState<string | null>(null);

  // Create current user data
  const currentUser: UserWithCalendar = {
    user: {
      userPrincipalName: "you@company.com",
      displayName: "You",
      id: "current-user",
    } as GraphUser,
    ntUser: "you",
    initials: "YOU",
    color: "bg-red-500",
    events: generateMockEvents(0),
  };

  // Create user calendar data with real GraphUser objects
  const userCalendars: UserWithCalendar[] = [
    currentUser,
    ...selectedGraphUsers.map((user, index) => {
      const ntUser = getNtUserByUserPrincipalName(user.userPrincipalName);
      const initials = user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
      ];

      return {
        user,
        ntUser,
        initials,
        color: colors[index % colors.length],
        events: generateMockEvents(index + 1),
      };
    }),
  ];

  const findCommonFreeTime = (): string => {
    // Algorithm to find a common free time slot
    const busySlots = new Set<string>();

    userCalendars.forEach(({ events }) => {
      events.forEach((event) => {
        const startHour = parseInt(event.time.split(":")[0]);
        const durationHours = Math.ceil(event.duration / 60);

        for (let i = 0; i < durationHours; i++) {
          const slotHour = startHour + i;
          if (slotHour >= 8 && slotHour < 20) {
            busySlots.add(`${slotHour.toString().padStart(2, "0")}:00`);
          }
        }
      });
    });

    const freeSlots = timeSlots.filter((slot) => !busySlots.has(slot));
    return freeSlots[0] || "10:00"; // Default fallback
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const commonFreeTime = findCommonFreeTime();
    setSuggestedTime(commonFreeTime);
    setIsGenerating(false);
  };

  const getEventStyle = (event: CalendarEvent) => {
    const startHour = parseInt(event.time.split(":")[0]);
    const top = (startHour - 8) * 40 + 40; // Smaller slots for comparison view
    const height = (event.duration / 60) * 40;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`, // Minimum height for visibility
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Team Calendar Comparison
          </h3>
          <p className="text-sm text-gray-600">
            Comparing schedules for {userCalendars.length} team members
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to User Selection
        </Button>
      </div>

      {/* Team Members */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Users className="h-5 w-5 text-gray-500" />
        <div className="flex -space-x-2">
          {userCalendars.map((userCal, index) => (
            <div
              key={userCal.user.userPrincipalName}
              className={`w-8 h-8 ${userCal.color} rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm`}
              title={userCal.user.displayName}
            >
              {userCal.initials}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {userCalendars.map((u) => u.user.displayName).join(", ")}
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${userCalendars.length}, 1fr)` }}
      >
        {userCalendars.map((userCal, userIndex) => (
          <Card
            key={userCal.user.userPrincipalName}
            className="overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${userCal.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {userCal.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm truncate">
                    {userCal.user.displayName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {userCal.user.userPrincipalName}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative" style={{ height: "480px" }}>
                {/* Time slots */}
                {timeSlots.map((timeSlot, index) => (
                  <div
                    key={timeSlot}
                    className="absolute left-0 right-0 border-b border-gray-100 text-xs text-gray-500 pl-2"
                    style={{
                      top: `${index * 40}px`,
                      height: "40px",
                      lineHeight: "40px",
                    }}
                  >
                    {userIndex === 0 && (
                      <span className="text-xs text-gray-400">{timeSlot}</span>
                    )}
                  </div>
                ))}

                {/* Events */}
                {userCal.events.map((event) => (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 ${event.color} text-white text-xs p-1 rounded shadow-sm`}
                    style={getEventStyle(event)}
                  >
                    <div className="font-medium truncate" title={event.title}>
                      {event.title}
                    </div>
                    <div className="opacity-75 text-xs">
                      {event.time} ({event.duration}min)
                    </div>
                  </div>
                ))}

                {/* Suggested time highlight */}
                {suggestedTime && (
                  <div
                    className="absolute left-2 right-2 bg-green-500 text-white text-xs p-1 rounded shadow-lg border-2 border-green-300 animate-pulse"
                    style={{
                      top: `${(parseInt(suggestedTime.split(":")[0]) - 8) * 40 + 40}px`,
                      height: "40px",
                    }}
                  >
                    <div className="font-bold flex items-center">
                      🍅 <span className="ml-1 truncate">Focus Time</span>
                    </div>
                    <div className="opacity-90">{suggestedTime}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Actions */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900">AI-Powered Scheduling</h4>
          <p className="text-sm text-gray-600">
            Find the perfect time when all {userCalendars.length} participants
            are available for a focus session
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!suggestedTime ? (
            <Button
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 animate-spin" />
                    <span>Analyzing {userCalendars.length} calendars...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>AI Generate Session</span>
                    <Zap className="h-3 w-3" />
                  </>
                )}
              </div>
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-500 text-white px-3 py-1 animate-bounce">
                <CheckCircle className="h-4 w-4 mr-1" />
                Perfect slot found!
              </Badge>
              <Button
                onClick={() => onCreateSession(suggestedTime)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create Session at {suggestedTime}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
