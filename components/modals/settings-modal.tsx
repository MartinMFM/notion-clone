"use client";

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { ModeToggle } from "../mode-toggle";

export const SettingsModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="p-6">
        <h2 className="text-lg font-medium mb-4">My Settings</h2>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize your experience
            </span>
          </div>

          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
