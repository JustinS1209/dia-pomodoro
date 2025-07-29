// TODO check if this is correct
export type CalendarData = {
  subject: string;
  start: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC";
  };
  end: {
    dateTime: string; // e.g. "2025-07-30T13:00:00.0000000"
    timeZone: string; // e.g. "UTC";
  };
};
