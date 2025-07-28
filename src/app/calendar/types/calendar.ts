export interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  duration: number;
  type: "meeting" | "presentation" | "review";
  attendees?: number;
  location?: string;
  color: string;
}

export interface PomodoroSession {
  id: number;
  time: string;
  duration: number;
  type: "pomodoro";
  title: string;
  color: string;
}

export interface TimeSlot {
  time: string;
  isFree: boolean;
  isCurrent: boolean;
}
