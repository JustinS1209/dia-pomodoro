import {
  CalendarData,
  MeetingTimeSlot,
  MeetingTimeSuggestion,
  MeetingTimeSuggestionsResult,
} from "@/features/calendar/configurations/types";
import { graphAxios } from "@/lib/axios";

export async function fetchCalendarEventsMe(
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

export async function fetchCalendarEvents(
  startDate: Date,
  endDate: Date,
  userPrincipalName: string,
): Promise<CalendarData[]> {
  const requestData = {
    attendees: [
      {
        emailAddress: {
          address: userPrincipalName,
          name: "User",
        },
        type: "Required",
      },
    ],
    timeConstraint: {
      timeslots: [
        {
          start: {
            dateTime: startDate.toISOString(),
            timeZone: "Pacific Standard Time",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "Pacific Standard Time",
          },
        },
      ],
    },
    meetingDuration: "PT1H",
  };

  const apiUrl = "https://graph.microsoft.com/v1.0/me/findMeetingTimes";

  try {
    const response = await graphAxios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const meetingTimeSuggestionResult =
      response.data as MeetingTimeSuggestionsResult;

    return mapFreeSlotsDataToCalendarData(
      meetingTimeSuggestionResult.meetingTimeSuggestions,
    );
  } catch (error) {
    console.error("Error creating meeting request:");
    return [];
  }
}

function mapFreeSlotsDataToCalendarData(
  freeSlots: MeetingTimeSuggestion[],
  date: string = new Date().toISOString().split("T")[0],
  timeZone: string = "UTC",
): CalendarData[] {
  const busySlots: CalendarData[] = [];

  // Define working hours (7:00 to 19:00)
  const workStart = `${date}T07:00:00.0000000`;
  const workEnd = `${date}T19:00:00.0000000`;

  console.log(freeSlots);

  // Sort free slots by start time
  const sortedFreeSlots = [...freeSlots].sort(
    (a, b) =>
      new Date(a.meetingTimeSlot.start.dateTime).getTime() -
      new Date(b.meetingTimeSlot.start.dateTime).getTime(),
  );

  console.log(sortedFreeSlots);

  let currentTime = workStart;

  for (const freeSlot of sortedFreeSlots) {
    // If there's a gap before this free slot, it's busy time
    if (currentTime < freeSlot.meetingTimeSlot.start.dateTime) {
      busySlots.push({
        start: {
          dateTime: currentTime,
          timeZone: timeZone,
        },
        end: {
          dateTime: freeSlot.meetingTimeSlot.start.dateTime,
          timeZone: timeZone,
        },
        subject: "Busy",
      });
    }

    // Move current time to the end of this free slot
    currentTime = freeSlot.meetingTimeSlot.end.dateTime;
  }

  // If there's time left after the last free slot until work end, it's busy
  if (currentTime < workEnd) {
    busySlots.push({
      start: {
        dateTime: currentTime,
        timeZone: timeZone,
      },
      end: {
        dateTime: workEnd,
        timeZone: timeZone,
      },
      subject: "Busy",
    });
  }

  return busySlots;
}
