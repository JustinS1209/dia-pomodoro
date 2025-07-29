import axios from "axios";
import { CalendarData } from "@/features/calendar/configurations/types";

// TODO test for correctness
export function fetchCalendarEvents(
  startDate: Date,
  endDate: Date,
  userPrincipalName: string,
): Promise<CalendarData[]> {
  const requestUrl = `https://graph.microsoft.com/v1.0/users/${userPrincipalName}/calendarview?startdatetime=${startDate}&enddatetime=${endDate}`;
  return (await axios.get(requestUrl)).value;
}
