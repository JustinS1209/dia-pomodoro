import { CalendarData } from "@/features/calendar/configurations/types";
import { graphAxios } from "@/lib/axios";

export async function fetchCalendarEvents(
  startDate: Date,
  endDate: Date,
  userPrincipalName: string,
): Promise<CalendarData[]> {
  const start = startDate.toISOString();
  const end = endDate.toISOString();
  const requestUrl = `https://graph.microsoft.com/v1.0/users/${userPrincipalName}/calendarview?startdatetime=${start}&enddatetime=${end}`;

  const response = await graphAxios.get(requestUrl);
  return response.data.value;
}
