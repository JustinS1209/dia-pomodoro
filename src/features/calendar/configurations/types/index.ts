export type CalendarData = {
  subject: string;
} & MeetingTimeSlot;

export type MeetingTimeSlot = {
  start: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC";
  };
  end: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC";
  };
};

export type MeetingTimeSuggestion = { meetingTimeSlot: MeetingTimeSlot };

export type MeetingTimeSuggestionsResult = {
  meetingTimeSuggestions: MeetingTimeSuggestion[];
};
