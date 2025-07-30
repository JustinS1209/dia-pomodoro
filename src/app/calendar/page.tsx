"use client";

import React, { useState, useEffect } from "react";
import { CalendarHeader } from "@/app/calendar/_components/CalendarHeader";
import { CalendarGrid } from "@/app/calendar/_components/CalendarGrid";
import { CalendarStats } from "@/app/calendar/_components/CalendarStats";
import { CalendarInstructions } from "@/app/calendar/_components/CalendarInstructions";
import { timeSlots } from "@/lib/calendar-data";
import { CalendarEvent, PomodoroSession } from "@/app/calendar/types/calendar";

const CalendarPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(
    [],
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Find free time slots based on actual calendar events and pomodoro sessions
  const findFreeSlots = (): string[] => {
    const busySlots = new Set<string>();

    // Mark slots occupied by calendar events
    calendarEvents.forEach((event: CalendarEvent) => {
      const startHour = parseInt(event.time.split(":")[0]);
      const durationHours = Math.ceil(event.duration / 60);

      for (let i = 0; i < durationHours; i++) {
        const slotHour = startHour + i;
        if (slotHour >= 8 && slotHour < 20) {
          busySlots.add(`${slotHour.toString().padStart(2, "0")}:00`);
        }
      }
    });

    // Mark slots occupied by existing pomodoro sessions
    pomodoroSessions.forEach((session: PomodoroSession) => {
      busySlots.add(session.time);
    });

    // Return free slots (maximum 4 sessions per day)
    const freeSlots = timeSlots.filter((slot) => !busySlots.has(slot));
    return freeSlots.slice(0, Math.min(4, freeSlots.length));
  };

  const generatePomodoroSessions = async (): Promise<void> => {
    const freeSlots = findFreeSlots();
    if (freeSlots.length === 0) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const activityTitles = [
      "Focus Session"
    ];

    const newSessions: PomodoroSession[] = freeSlots.map((timeSlot, index) => ({
      id: Date.now() + index,
      time: timeSlot,
      duration: 50,
      type: "pomodoro",
      title: activityTitles[index % activityTitles.length],
      color: "bg-red-500",
    }));

    setPomodoroSessions((prev) => [...prev, ...newSessions]);
    setIsGenerating(false);
  };

  const clearPomodoroSession = (sessionId: number): void => {
    setPomodoroSessions((prev) =>
      prev.filter((session) => session.id !== sessionId),
    );
  };

  const clearAllSessions = (): void => {
    setPomodoroSessions([]);
  };

  // Callback to receive events from CalendarGrid
  const handleEventsUpdate = (events: CalendarEvent[], loading: boolean) => {
    setCalendarEvents(events);
    setEventsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16 sm:pt-20 lg:pt-24 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <CalendarHeader
          currentTime={currentTime}
          isGenerating={isGenerating}
          onGenerateSessions={generatePomodoroSessions}
          onClearSessions={clearAllSessions}
          freeSlots={findFreeSlots()}
        />

        <CalendarStats
          eventsCount={calendarEvents.length}
          sessionsCount={pomodoroSessions.length}
          freeSlots={findFreeSlots().length}
        />

        <CalendarGrid
          pomodoroSessions={pomodoroSessions}
          currentTime={currentTime}
          freeSlots={findFreeSlots()}
          onClearSession={clearPomodoroSession}
          onEventsUpdate={handleEventsUpdate}
        />

        <CalendarInstructions
          pomodoroSessions={pomodoroSessions}
          freeSlots={findFreeSlots()}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
