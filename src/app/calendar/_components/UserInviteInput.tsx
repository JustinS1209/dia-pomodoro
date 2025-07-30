// src/components/calendar/UserInviteInput.tsx

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";
import UserSelect from "@/features/user/components/UserSelect"; // Your existing component
import { GraphUser } from "@/features/user/configurations/types";
import { fetchCalendarEventsForToday } from "@/features/calendar/utils";
import { ntUserToUserPrincipalName } from "@/features/common/utils";

interface UserInviteInputProps {
  invitedUsers: string[]; // Array of NT users
  selectedGraphUsers: GraphUser[]; // Array of GraphUser objects
  onUsersChange: (users: string[]) => void;
  onGraphUsersChange: (users: GraphUser[]) => void;
  onSeeCalendars: () => void;
  disabled?: boolean;
}

export const UserInviteInput: React.FC<UserInviteInputProps> = ({
  invitedUsers,
  selectedGraphUsers,
  onUsersChange,
  onGraphUsersChange,
  onSeeCalendars,
  disabled = false,
}) => {
  const handleUpdateSelected = (selected: string[], ntUser: string) => {
    onUsersChange(selected);
  };

  useEffect(() => {
    if (invitedUsers.length === 0) {
      return;
    }
    fetchCalendarEventsForToday(ntUserToUserPrincipalName("rce4fe")).then(
      (events) => {
        console.log(events);
      },
    );
  }, [invitedUsers]);

  const handleUpdateSelectedGraphUser = (
    updatedSelected: GraphUser[],
    value: GraphUser,
  ) => {
    onGraphUsersChange(updatedSelected);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-purple-600" />
          <label className="text-lg font-semibold text-gray-900">
            Invite Team Members
          </label>
        </div>
        <p className="text-sm text-gray-600">
          Search and select team members to join your shared Pomodoro session
        </p>
      </div>

      {/* User Selection */}
      <div className="space-y-4">
        <UserSelect
          selected={invitedUsers}
          excluded={[]} // You can add excluded users if needed
          handleUpdateSelected={handleUpdateSelected}
          handleUpdateSelectedGraphUser={handleUpdateSelectedGraphUser}
          disabled={disabled}
          className="w-full"
        />

        {/* Selected Users Summary */}
        {selectedGraphUsers.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-purple-900">
                Selected Participants ({selectedGraphUsers.length + 1})
              </span>
              <div className="flex -space-x-2">
                {/* Current user */}
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm">
                  YOU
                </div>
                {/* Selected users */}
                {selectedGraphUsers.slice(0, 4).map((user, index) => {
                  const initials = user.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const colors = [
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-pink-500",
                  ];

                  return (
                    <div
                      key={user.userPrincipalName}
                      className={`w-8 h-8 ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm`}
                      title={user.displayName}
                    >
                      {initials}
                    </div>
                  );
                })}
                {selectedGraphUsers.length > 4 && (
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm">
                    +{selectedGraphUsers.length - 4}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-purple-700 font-medium">
                You + {selectedGraphUsers.length} team members:
              </div>
              <div className="text-xs text-purple-600">
                {selectedGraphUsers.map((user) => user.displayName).join(", ")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* See Calendars Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={onSeeCalendars}
          disabled={selectedGraphUsers.length === 0 || disabled}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">
              Analyze {selectedGraphUsers.length + 1} Calendar
              {selectedGraphUsers.length !== 0 ? "s" : ""}
            </span>
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, selectedGraphUsers.length + 1))].map(
                (_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-white/30 rounded-full border border-white/50"
                  />
                ),
              )}
            </div>
          </div>
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-blue-900">How it works</h4>
            <p className="text-sm text-blue-700">
              Our AI will analyze everyone's calendar to find the perfect time
              when all participants are available for a synchronized Pomodoro
              session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
