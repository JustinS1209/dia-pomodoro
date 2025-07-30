import { fetchCalendarEvents } from "@/features/calendar/api";
import { CalendarData } from "@/features/calendar/configurations/types";

export function fetchCalendarEventsForToday(
  userPrincipalName: string,
): Promise<CalendarData[]> {
  return fetchCalendarEvents(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(23, 59, 59, 999)),
    userPrincipalName,
  );
}
