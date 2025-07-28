// src/lib/calendar-data.ts

import { CalendarEvent } from "@/app/calendar/types/calendar";

export const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Daily Standup",
    time: "09:00",
    duration: 30,
    type: "meeting",
    attendees: 5,
    location: "Teams",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Design Review",
    time: "10:30",
    duration: 60,
    type: "meeting",
    attendees: 3,
    location: "Conference Room A",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Client Presentation",
    time: "14:00",
    duration: 90,
    type: "presentation",
    attendees: 8,
    location: "Zoom",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Code Review",
    time: "16:00",
    duration: 45,
    type: "review",
    attendees: 2,
    location: "Online",
    color: "bg-orange-500",
  },
];

// Time slots for the day (8 AM to 8 PM)
export const timeSlots: string[] = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});
