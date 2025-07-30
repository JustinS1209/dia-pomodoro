// Microsoft Graph Calendar Event type - more complete
export type CalendarData = {
  id?: string;
  subject: string;
  start: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC" or "Europe/Amsterdam";
  };
  end: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC" or "Europe/Amsterdam";
  };
  isCancelled?: boolean;
  isAllDay?: boolean;
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
  attendees?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
    type: string;
    status: {
      response: string;
      time: string;
    };
  }>;
  location?: {
    displayName: string;
  };
  organizer?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
};
