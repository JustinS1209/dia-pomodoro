import React from "react";

interface CalendarStatsProps {
  eventsCount: number;
  sessionsCount: number;
  freeSlots: number;
}

export const CalendarStats: React.FC<CalendarStatsProps> = ({
  eventsCount,
  sessionsCount,
  freeSlots,
}) => {
  return (
    <div className="flex items-center space-x-6 text-sm text-gray-500">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded"></div>
        <span>Meetings ({eventsCount})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded"></div>
        <span>Focus Sessions ({sessionsCount})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-100 border-2 border-green-500 rounded"></div>
        <span>Available ({freeSlots})</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-100 border-2 border-blue-500 rounded"></div>
        <span>Current Time</span>
      </div>
    </div>
  );
};
