import axios from "axios";
import { CalendarData } from "@/features/calendar/configurations/types";

// TODO test for correctness
export async function fetchCalendarEvents(
  startDate: Date,
  endDate: Date,
  userPrincipalName: string,
): Promise<CalendarData[]> {
  const start = startDate.toISOString();
  const end = endDate.toISOString();
  const requestUrl = `https://graph.microsoft.com/v1.0/users/${userPrincipalName}/calendarview?startdatetime=${start}&enddatetime=${end}`;
  const response = await axios.get(requestUrl);
  return response.data.value;
}
