import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { SharedSessionDialog } from "./SharedSessionDialog";

export const SharedSessionButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={handleOpenDialog}
        className="group border-2 border-purple-200 text-purple-700 hover:border-purple-500 hover:text-purple-800 hover:bg-purple-50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Users className="h-5 w-5" />
            <Plus className="h-3 w-3 absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <span className="font-semibold">Create Shared Session</span>
        </div>
      </Button>

      <SharedSessionDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};
