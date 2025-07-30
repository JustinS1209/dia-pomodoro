import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {AlertCircle, Brain, Calendar, CheckCircle, Loader2, RefreshCw, Sparkles, Users, Zap,} from "lucide-react";
import {GraphUser} from "@/features/user/configurations/types";
import {getNtUserByUserPrincipalName} from "@/features/user/utils";
import {fetchCalendarEventsForToday} from "@/features/calendar/utils";

interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    duration: number;
    color: string;
    attendees?: number;
    location?: string;
}

interface UserWithCalendar {
    user: GraphUser;
    ntUser: string;
    initials: string;
    color: string;
    events: CalendarEvent[];
    loading: boolean;
    error?: string;
}

interface CalendarComparisonProps {
    selectedGraphUsers: GraphUser[];
    onCreateSession: (sessionTime: string) => void;
    onBack: () => void;
}

// Helper function to transform Graph events to CalendarEvent format
const transformGraphEventForComparison = (graphEvent: any): CalendarEvent | null => {
    try {
        // Skip cancelled or all-day events
        if (graphEvent.isCancelled || graphEvent.isAllDay) {
            return null;
        }

        // Parse start time with timezone adjustment (add 2 hours as per your original fix)
        let startDate = new Date(graphEvent.start.dateTime);
        startDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

        // Parse end time
        let endDate = new Date(graphEvent.end.dateTime);
        endDate = new Date(endDate.getTime() + (2 * 60 * 60 * 1000));

        // Calculate duration in minutes
        const durationMs = endDate.getTime() - startDate.getTime();
        const duration = Math.round(durationMs / (1000 * 60));

        // Format time as HH:MM
        const time = startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        // Only include events within business hours (8:00 - 20:00)
        const eventHour = startDate.getHours();
        if (eventHour < 8 || eventHour >= 20) {
            return null;
        }

        // Determine color based on event type
        const getEventColor = (): string => {
            if (graphEvent.isOnlineMeeting) {
                if (graphEvent.onlineMeetingProvider === "teamsForBusiness") {
                    return "bg-blue-500"; // Teams meetings
                }
                return "bg-purple-500"; // Other online meetings
            }

            const attendeeCount = graphEvent.attendees?.length || 0;
            if (attendeeCount > 10) return "bg-red-500";
            if (attendeeCount > 5) return "bg-orange-500";
            if (attendeeCount > 2) return "bg-green-500";
            return "bg-indigo-500";
        };

        // Count attendees (excluding declined)
        const attendeeCount = graphEvent.attendees?.filter(
            (attendee: any) => attendee.status.response !== "declined"
        ).length || 0;

        return {
            id: graphEvent.id,
            title: graphEvent.subject || "Untitled Event",
            time: time,
            duration: duration,
            color: getEventColor(),
            attendees: attendeeCount > 0 ? attendeeCount : undefined,
            location: graphEvent.location?.displayName ||
                (graphEvent.isOnlineMeeting ? "Online Meeting" : undefined),
        };
    } catch (error) {
        console.error("Error transforming graph event:", error);
        return null;
    }
};

const timeSlots = Array.from({length: 12}, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
});

export const CalendarComparison: React.FC<CalendarComparisonProps> = ({
                                                                          selectedGraphUsers,
                                                                          onCreateSession,
                                                                          onBack,
                                                                      }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestedTime, setSuggestedTime] = useState<string | null>(null);
    const [userCalendars, setUserCalendars] = useState<UserWithCalendar[]>([]);

    // Initialize user calendars with loading state
    useEffect(() => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-cyan-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-orange-500",
        ];

        const initialUserCalendars: UserWithCalendar[] = selectedGraphUsers.map((user, index) => {
            const ntUser = getNtUserByUserPrincipalName(user.userPrincipalName);
            const initials = user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return {
                user,
                ntUser,
                initials,
                color: colors[index % colors.length],
                events: [],
                loading: true,
            };
        });

        setUserCalendars(initialUserCalendars);
    }, [selectedGraphUsers]);

    // Fetch calendar events for all users
    useEffect(() => {
        const fetchAllUserEvents = async () => {
            const updatedCalendars = await Promise.all(
                userCalendars.map(async (userCal) => {
                    try {
                        console.log(`Fetching events for ${userCal.user.displayName}`);

                        // Fetch events for this user
                        const graphEvents = await fetchCalendarEventsForToday(userCal.user.userPrincipalName);

                        console.log(`Fetched ${graphEvents.length} raw events for ${userCal.user.displayName}`);

                        // Transform events to CalendarEvent format
                        const transformedEvents = graphEvents
                            .map(transformGraphEventForComparison)
                            .filter((event): event is CalendarEvent => event !== null)
                            .sort((a, b) => a.time.localeCompare(b.time));

                        console.log(`Transformed ${transformedEvents.length} events for ${userCal.user.displayName}`);

                        return {
                            ...userCal,
                            events: transformedEvents,
                            loading: false,
                            error: undefined,
                        };
                    } catch (error) {
                        console.error(`Error fetching events for ${userCal.user.displayName}:`, error);
                        return {
                            ...userCal,
                            events: [],
                            loading: false,
                            error: error instanceof Error ? error.message : "Failed to fetch events",
                        };
                    }
                })
            );

            setUserCalendars(updatedCalendars);
        };

        // Only fetch if we have user calendars with loading state
        if (userCalendars.length > 0 && userCalendars.some(uc => uc.loading)) {
            fetchAllUserEvents();
        }
    }, [userCalendars.length > 0 && userCalendars.some(uc => uc.loading)]);

    const findCommonFreeTime = (): string => {
        // Algorithm to find a common free time slot
        const busySlots = new Set<string>();

        userCalendars.forEach(({events}) => {
            events.forEach((event) => {
                const startHour = parseInt(event.time.split(":")[0]);
                const durationHours = Math.ceil(event.duration / 60);

                for (let i = 0; i < durationHours; i++) {
                    const slotHour = startHour + i;
                    if (slotHour >= 8 && slotHour < 20) {
                        busySlots.add(`${slotHour.toString().padStart(2, "0")}:00`);
                    }
                }
            });
        });

        const freeSlots = timeSlots.filter((slot) => !busySlots.has(slot));
        return freeSlots[0] || "10:00"; // Default fallback
    };

    const handleAIGenerate = async () => {
        setIsGenerating(true);

        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const commonFreeTime = findCommonFreeTime();
        setSuggestedTime(commonFreeTime);
        setIsGenerating(false);
    };

    const handleRefreshEvents = () => {
        // Reset loading state to trigger refetch
        setUserCalendars(prev => prev.map(uc => ({...uc, loading: true, error: undefined})));
        setSuggestedTime(null);
    };

    const getEventStyle = (event: CalendarEvent) => {
        const startHour = parseInt(event.time.split(":")[0]);
        const startMinute = parseInt(event.time.split(":")[1]) || 0;

        // Calculate position including minutes
        const top = (startHour - 8) * 40 + (startMinute / 60) * 40;
        const height = Math.max((event.duration / 60) * 40, 20); // Minimum height for visibility

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    const isLoading = userCalendars.some(uc => uc.loading);
    const hasErrors = userCalendars.some(uc => uc.error);
    const totalEvents = userCalendars.reduce((sum, uc) => sum + uc.events.length, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Team Calendar Comparison
                    </h3>
                    <p className="text-sm text-gray-600">
                        Comparing schedules for {userCalendars.length} team members
                        {!isLoading && (
                            <span className="ml-2 text-gray-500">
                • {totalEvents} total meetings
              </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefreshEvents}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}/>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back to User Selection
                    </Button>
                </div>
            </div>

            {/* Loading/Error Status */}
            {(isLoading || hasErrors) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        {isLoading && (
                            <div className="flex items-center space-x-2 text-blue-600">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                <span className="text-sm">Loading calendar events...</span>
                            </div>
                        )}
                        {hasErrors && (
                            <div className="flex items-center space-x-2 text-red-600">
                                <AlertCircle className="h-4 w-4"/>
                                <span className="text-sm">Some calendars failed to load</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Team Members */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-500"/>
                <div className="flex -space-x-2">
                    {userCalendars.map((userCal, index) => (
                        <div
                            key={userCal.user.userPrincipalName}
                            className={`w-8 h-8 ${userCal.color} rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm relative`}
                            title={`${userCal.user.displayName} - ${userCal.events.length} meetings`}
                        >
                            {userCal.loading ? (
                                <Loader2 className="h-3 w-3 animate-spin"/>
                            ) : userCal.error ? (
                                <AlertCircle className="h-3 w-3"/>
                            ) : (
                                userCal.initials
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-sm text-gray-600">
                    {userCalendars.map((u) => u.user.displayName).join(", ")}
                </div>
            </div>

            {/* Calendar Grid */}
            <div
                className="grid gap-4"
                style={{gridTemplateColumns: `repeat(${userCalendars.length}, 1fr)`}}
            >
                {userCalendars.map((userCal, userIndex) => (
                    <Card
                        key={userCal.user.userPrincipalName}
                        className="overflow-hidden"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-8 h-8 ${userCal.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
                                >
                                    {userCal.loading ? (
                                        <Loader2 className="h-3 w-3 animate-spin"/>
                                    ) : userCal.error ? (
                                        <AlertCircle className="h-3 w-3"/>
                                    ) : (
                                        userCal.initials
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm truncate">
                                        {userCal.user.displayName}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userCal.loading ? (
                                            "Loading..."
                                        ) : userCal.error ? (
                                            <span className="text-red-500">Error loading</span>
                                        ) : (
                                            `${userCal.events.length} meetings`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative" style={{height: "480px"}}>
                                {/* Time slots */}
                                {timeSlots.map((timeSlot, index) => (
                                    <div
                                        key={timeSlot}
                                        className="absolute left-0 right-0 border-b border-gray-100 text-xs text-gray-500 pl-2"
                                        style={{
                                            top: `${index * 40}px`,
                                            height: "40px",
                                            lineHeight: "40px",
                                        }}
                                    >
                                        {userIndex === 0 && (
                                            <span className="text-xs text-gray-400">{timeSlot}</span>
                                        )}
                                    </div>
                                ))}

                                {/* Loading overlay */}
                                {userCal.loading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <div className="text-center space-y-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto"/>
                                            <p className="text-xs text-gray-600">Loading events...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error state */}
                                {userCal.error && (
                                    <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center">
                                        <div className="text-center space-y-2 p-2">
                                            <AlertCircle className="h-6 w-6 text-red-500 mx-auto"/>
                                            <p className="text-xs text-red-600 max-w-32">
                                                Failed to load events
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Events */}
                                {!userCal.loading && !userCal.error && userCal.events.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`absolute left-2 right-2 ${event.color} text-white text-xs p-1 rounded shadow-sm`}
                                        style={getEventStyle(event)}
                                        title={`${event.title} - ${event.time} (${event.duration}min)`}
                                    >
                                        <div className="font-medium truncate">
                                            {event.title}
                                        </div>
                                        <div className="opacity-75 text-xs">
                                            {event.time} ({event.duration}min)
                                        </div>
                                        {event.attendees && (
                                            <div className="opacity-75 text-xs flex items-center">
                                                <Users className="h-2 w-2 mr-1"/>
                                                {event.attendees}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Suggested time highlight */}
                                {suggestedTime && !userCal.loading && (
                                    <div
                                        className="absolute left-2 right-2 bg-green-500 text-white text-xs p-1 rounded shadow-lg border-2 border-green-300 animate-pulse"
                                        style={{
                                            top: `${(parseInt(suggestedTime.split(":")[0]) - 8) * 40}px`,
                                            height: "40px",
                                        }}
                                    >
                                        <div className="font-bold flex items-center">
                                            🍅 <span className="ml-1 truncate">Focus Time</span>
                                        </div>
                                        <div className="opacity-90">{suggestedTime}</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* AI Actions */}
            <div
                className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">AI-Powered Scheduling</h4>
                    <p className="text-sm text-gray-600">
                        Find the perfect time when all {userCalendars.length} participants
                        are available for a focus session
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {!suggestedTime ? (
                        <Button
                            onClick={handleAIGenerate}
                            disabled={isGenerating || isLoading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center space-x-2">
                                {isGenerating ? (
                                    <>
                                        <Brain className="h-4 w-4 animate-spin"/>
                                        <span>Analyzing {userCalendars.length} calendars...</span>
                                    </>
                                ) : isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        <span>Loading calendars...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4"/>
                                        <span>AI Generate Session</span>
                                        <Zap className="h-3 w-3"/>
                                    </>
                                )}
                            </div>
                        </Button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Badge className="bg-green-500 text-white px-3 py-1 animate-bounce">
                                <CheckCircle className="h-4 w-4 mr-1"/>
                                Perfect slot found!
                            </Badge>
                            <Button
                                onClick={() => onCreateSession(suggestedTime)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <Calendar className="h-4 w-4 mr-2"/>
                                Create Session at {suggestedTime}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};