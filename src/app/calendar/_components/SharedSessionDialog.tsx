// src/components/calendar/SharedSessionDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserInviteInput } from "./UserInviteInput";
import { CalendarComparison } from "./CalendarComparison";
import { Users, Calendar, Sparkles, CheckCircle } from "lucide-react";
import { GraphUser } from "@/features/user/configurations/types";

interface SharedSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type DialogStep = "invite" | "calendars" | "success";

export const SharedSessionDialog: React.FC<SharedSessionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<DialogStep>("invite");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // NT users
  const [selectedGraphUsers, setSelectedGraphUsers] = useState<GraphUser[]>([]); // GraphUser objects
  const [createdSessionTime, setCreatedSessionTime] = useState<string>("");

  const handleUsersChange = (users: string[]) => {
    setInvitedUsers(users);
  };

  const handleGraphUsersChange = (users: GraphUser[]) => {
    setSelectedGraphUsers(users);
  };

  const handleSeeCalendars = () => {
    setCurrentStep("calendars");
  };

  const handleBackToInvite = () => {
    setCurrentStep("invite");
  };

  const handleCreateSession = (sessionTime: string) => {
    setCreatedSessionTime(sessionTime);
    setCurrentStep("success");

    // Here you would typically make an API call to create the session
    console.log("Creating shared session at", sessionTime, "with users:", {
      ntUsers: invitedUsers,
      graphUsers: selectedGraphUsers,
    });
  };

  const handleClose = () => {
    // Reset state when closing
    setCurrentStep("invite");
    setInvitedUsers([]);
    setSelectedGraphUsers([]);
    setCreatedSessionTime("");
    onClose();
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case "invite":
        return "Create Shared Focus Session";
      case "calendars":
        return "Team Calendar Analysis";
      case "success":
        return "Session Created Successfully!";
      default:
        return "Create Shared Focus Session";
    }
  };

  const getDialogDescription = () => {
    switch (currentStep) {
      case "invite":
        return "Invite team members to join a synchronized Pomodoro session. Our AI will find the perfect time when everyone is available.";
      case "calendars":
        return "Comparing team calendars to find the optimal time for your shared focus session.";
      case "success":
        return `Your shared focus session has been scheduled for ${createdSessionTime}. All participants will receive calendar invitations.`;
      default:
        return "";
    }
  };

  const getDialogIcon = () => {
    switch (currentStep) {
      case "invite":
        return <Users className="h-6 w-6 text-purple-600" />;
      case "calendars":
        return <Calendar className="h-6 w-6 text-blue-600" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <Users className="h-6 w-6 text-purple-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            {getDialogIcon()}
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {getDialogTitle()}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {getDialogDescription()}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === "invite"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === "invite" ? "text-purple-600" : "text-gray-500"
                }`}
              >
                Invite Users
              </span>
            </div>

            <div
              className={`h-0.5 w-12 transition-all duration-300 ${
                ["calendars", "success"].includes(currentStep)
                  ? "bg-purple-500"
                  : "bg-gray-200"
              }`}
            />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === "calendars"
                    ? "bg-blue-500 text-white"
                    : ["calendars", "success"].includes(currentStep)
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === "calendars"
                    ? "text-blue-600"
                    : ["calendars", "success"].includes(currentStep)
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                Compare Calendars
              </span>
            </div>

            <div
              className={`h-0.5 w-12 transition-all duration-300 ${
                currentStep === "success" ? "bg-green-500" : "bg-gray-200"
              }`}
            />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep === "success"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === "success" ? "text-green-600" : "text-gray-400"
                }`}
              >
                Create Session
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Dialog Content */}
        <div className="mt-6">
          {currentStep === "invite" && (
            <UserInviteInput
              invitedUsers={invitedUsers}
              selectedGraphUsers={selectedGraphUsers}
              onUsersChange={handleUsersChange}
              onGraphUsersChange={handleGraphUsersChange}
              onSeeCalendars={handleSeeCalendars}
            />
          )}

          {currentStep === "calendars" && (
            <CalendarComparison
              selectedGraphUsers={selectedGraphUsers}
              onCreateSession={handleCreateSession}
              onBack={handleBackToInvite}
            />
          )}

          {currentStep === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Shared Focus Session Created!
                </h3>
                <p className="text-gray-600">
                  Your team Pomodoro session is scheduled for{" "}
                  <strong>{createdSessionTime}</strong>
                </p>
              </div>

              {/* Participants Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    Participants ({selectedGraphUsers.length + 1})
                  </span>
                </div>
                <div className="flex justify-center -space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm">
                    YOU
                  </div>
                  {selectedGraphUsers.slice(0, 6).map((user, index) => {
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
                      "bg-indigo-500",
                      "bg-yellow-500",
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
                  {selectedGraphUsers.length > 6 && (
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm">
                      +{selectedGraphUsers.length - 6}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Next Steps</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1 text-left max-w-md mx-auto">
                  <li>✅ Calendar invitations sent to all participants</li>
                  <li>
                    ✅ Pomodoro session will start automatically at the
                    scheduled time
                  </li>
                  <li>✅ All team members will receive notifications</li>
                  <li>✅ Session timer will be synchronized across devices</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                >
                  Return to Calendar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
