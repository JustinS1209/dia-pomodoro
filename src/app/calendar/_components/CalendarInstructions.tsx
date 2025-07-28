import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Timer, Calendar } from "lucide-react";
import { PomodoroSession } from "@/app/calendar/types/calendar";

interface CalendarInstructionsProps {
  pomodoroSessions: PomodoroSession[];
  freeSlots: string[];
}

export const CalendarInstructions: React.FC<CalendarInstructionsProps> = ({
  pomodoroSessions,
  freeSlots,
}) => {
  if (pomodoroSessions.length > 0) return null;

  return (
    <div className="text-center">
      <Card className="shadow-lg border border-gray-100">
        <CardContent className="p-8">
          <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI-Powered Focus Planning
          </h3>
          <p className="text-gray-600 mb-4">
            Our AI analyzes your calendar and automatically finds the perfect
            time slots for focused work sessions. Simply click the AI button
            above to generate optimized Pomodoro sessions.
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span>Smart Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4" />
              <span>25min Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Auto Scheduling</span>
            </div>
          </div>

          {freeSlots.length > 0 && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                <strong>{freeSlots.length} free slots</strong> detected for
                Pomodoro sessions today
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
