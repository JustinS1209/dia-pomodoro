"use client";

import React, { useState, useEffect } from "react";
import { CalendarHeader } from "@/app/calendar/_components/CalendarHeader";
import { CalendarGrid } from "@/app/calendar/_components/CalendarGrid";
import { CalendarStats } from "@/app/calendar/_components/CalendarStats";
import { CalendarInstructions } from "@/app/calendar/_components/CalendarInstructions";
import { mockEvents, timeSlots } from "@/lib/calendar-data";
import { CalendarEvent, PomodoroSession } from "@/app/calendar/types/calendar";

const CalendarPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(
    [],
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Find free time slots automatically
  const findFreeSlots = (): string[] => {
    const busySlots = new Set<string>();

    // Mark slots occupied by existing events
    [...mockEvents, ...pomodoroSessions].forEach(
      (event: CalendarEvent | PomodoroSession) => {
        const startHour = parseInt(event.time.split(":")[0]);
        const durationHours = Math.ceil(event.duration / 60);

        for (let i = 0; i < durationHours; i++) {
          const slotHour = startHour + i;
          if (slotHour >= 8 && slotHour < 20) {
            busySlots.add(`${slotHour.toString().padStart(2, "0")}:00`);
          }
        }
      },
    );

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

    const newSessions: PomodoroSession[] = freeSlots.map((timeSlot, index) => ({
      id: Date.now() + index,
      time: timeSlot,
      duration: 25,
      type: "pomodoro",
      title: "AI Focus Session",
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
          eventsCount={mockEvents.length}
          sessionsCount={pomodoroSessions.length}
          freeSlots={findFreeSlots().length}
        />

        <CalendarGrid
          events={mockEvents}
          pomodoroSessions={pomodoroSessions}
          currentTime={currentTime}
          freeSlots={findFreeSlots()}
          onClearSession={clearPomodoroSession}
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
