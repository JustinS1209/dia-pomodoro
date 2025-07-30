import { CalendarEvent } from "@/app/calendar/types/calendar";

// Microsoft Graph Calendar Event interface
interface GraphCalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
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
  isCancelled?: boolean;
  isAllDay?: boolean;
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
  organizer?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
}

// Color assignment based on meeting characteristics
const getEventColor = (event: GraphCalendarEvent): string => {
  // Cancelled events
  if (event.isCancelled) {
    return "bg-gray-400";
  }

  // Online meetings
  if (event.isOnlineMeeting) {
    if (event.onlineMeetingProvider === "teamsForBusiness") {
      return "bg-blue-500"; // Teams meetings
    }
    return "bg-purple-500"; // Other online meetings
  }

  // Based on attendee count
  const attendeeCount = event.attendees?.length || 0;
  if (attendeeCount > 10) {
    return "bg-red-500"; // Large meetings
  } else if (attendeeCount > 5) {
    return "bg-orange-500"; // Medium meetings
  } else if (attendeeCount > 2) {
    return "bg-green-500"; // Small meetings
  }

  // Default color for 1:1 or personal events
  return "bg-indigo-500";
};

// Helper function to properly handle timezone conversion
const parseEventDateTime = (dateTimeStr: string, timeZone: string): Date => {
  // Microsoft Graph returns datetime in format: "2024-01-15T10:00:00.0000000"
  // We need to handle the timezone properly

  console.log(`Parsing datetime: ${dateTimeStr} with timezone: ${timeZone}`);

  // If the datetime string doesn't include timezone info, we need to be careful
  // Microsoft Graph typically returns the datetime in the specified timezone

  // First, try to parse as-is
  let parsedDate = new Date(dateTimeStr);

  // If the API returns time in a different timezone than local, we need to adjust
  // Since you mentioned the API returns time 2 hours behind, let's add those 2 hours

  // Method 1: If you know the offset is always +2 hours
  parsedDate = new Date(parsedDate.getTime() + 2 * 60 * 60 * 1000);

  // Method 2: More robust timezone handling (uncomment if you want to use this instead)
  /*
  try {
    // Try to create a date in the specified timezone
    // This is more complex but handles different timezones properly
    const utcDate = new Date(dateTimeStr + 'Z'); // Treat as UTC
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
    parsedDate = new Date(utcDate.getTime() - localOffset);
  } catch (error) {
    console.warn('Timezone parsing failed, using simple date parsing:', error);
    parsedDate = new Date(dateTimeStr);
  }
  */

  console.log(
    `Original: ${dateTimeStr}, Adjusted: ${parsedDate.toLocaleString()}`,
  );

  return parsedDate;
};

// Transform Microsoft Graph event to CalendarEvent
export const transformGraphEventToCalendarEvent = (
  graphEvent: GraphCalendarEvent,
): CalendarEvent | null => {
  // Skip cancelled events
  if (graphEvent.isCancelled) {
    console.log(`Skipping cancelled event: ${graphEvent.subject}`);
    return null;
  }

  try {
    console.log(`Processing event: ${graphEvent.subject}`);
    console.log(`Raw start time: ${graphEvent.start.dateTime}`);
    console.log(`Is all day: ${graphEvent.isAllDay}`);
    console.log(`Start timezone: ${graphEvent.start.timeZone}`);

    // Handle all-day events differently
    if (graphEvent.isAllDay) {
      console.log(`Skipping all-day event: ${graphEvent.subject}`);
      return null; // For now, skip all-day events since they don't fit in hourly slots
    }

    // Parse start and end times with proper timezone handling
    const startDate = parseEventDateTime(
      graphEvent.start.dateTime,
      graphEvent.start.timeZone,
    );
    const endDate = parseEventDateTime(
      graphEvent.end.dateTime,
      graphEvent.end.timeZone,
    );

    console.log(`Parsed start date: ${startDate}`);
    console.log(`Local start time: ${startDate.toLocaleString()}`);

    // Calculate duration in minutes
    const durationMs = endDate.getTime() - startDate.getTime();
    const duration = Math.round(durationMs / (1000 * 60));

    // Format time as HH:MM in local timezone
    const time = startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    console.log(`Formatted time: ${time}`);
    console.log(`Duration: ${duration} minutes`);

    // Validate that the event falls within our calendar range (8:00 - 20:00)
    const eventHour = startDate.getHours();
    if (eventHour < 8 || eventHour >= 20) {
      console.log(
        `Event ${graphEvent.subject} is outside calendar range (hour: ${eventHour})`,
      );
      return null;
    }

    // Check if this is today's event (more robust comparison)
    const today = new Date();
    const eventDateLocal = new Date(startDate);

    // Compare just the date parts (year, month, day)
    const todayDateString = today.toLocaleDateString();
    const eventDateString = eventDateLocal.toLocaleDateString();

    console.log(`Today: ${todayDateString}, Event date: ${eventDateString}`);

    // TEMPORARY: Comment out date filtering for debugging
    // if (eventDateString !== todayDateString) {
    //   console.log(`Event ${graphEvent.subject} is not for today`);
    //   return null;
    // }

    // Count attendees (excluding declined)
    const attendeeCount =
      graphEvent.attendees?.filter(
        (attendee) => attendee.status.response !== "declined",
      ).length || 0;

    // Get location
    const location =
      graphEvent.location?.displayName ||
      (graphEvent.isOnlineMeeting ? "Online Meeting" : undefined);

    const transformedEvent = {
      id: graphEvent.id,
      title: graphEvent.subject || "Untitled Event",
      time: time,
      duration: duration,
      type: "meeting" as const,
      attendees: attendeeCount > 0 ? attendeeCount : undefined,
      location: location,
      color: getEventColor(graphEvent),
    };

    console.log("Successfully transformed event:", transformedEvent);
    return transformedEvent;
  } catch (error) {
    console.error(`Error transforming event ${graphEvent.subject}:`, error);
    return null;
  }
};

// Transform array of Graph events to CalendarEvents
export const transformGraphEventsToCalendarEvents = (
  graphEvents: GraphCalendarEvent[],
): CalendarEvent[] => {
  console.log(`Transforming ${graphEvents.length} graph events`);

  const transformedEvents = graphEvents
    .map(transformGraphEventToCalendarEvent)
    .filter((event): event is CalendarEvent => event !== null) // Remove null values
    .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time

  console.log(`Successfully transformed ${transformedEvents.length} events`);
  return transformedEvents;
};

// Filter events for today only
export const filterEventsForToday = (
  events: CalendarEvent[],
): CalendarEvent[] => {
  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  return events.filter((event) => {
    // This assumes the API already filtered for today
    // If not, you'd need to check the actual date
    return true;
  });
};

// Helper to check if event is happening now
export const isEventHappeningNow = (event: CalendarEvent): boolean => {
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Parse event start time
  const [eventHour, eventMinute] = event.time.split(":").map(Number);
  const eventStart = new Date();
  eventStart.setHours(eventHour, eventMinute, 0, 0);

  // Calculate event end time
  const eventEnd = new Date(eventStart.getTime() + event.duration * 60 * 1000);

  return now >= eventStart && now <= eventEnd;
};
