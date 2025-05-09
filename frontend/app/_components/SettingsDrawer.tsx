import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SettingsIcon } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function SettingsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <SettingsIcon
          size={28}
          className="text-secondary-foreground cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent side="right" className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-medium">Settings</SheetTitle>
          </div>

          <div className="border-b-2 border-border" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <DarkModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
