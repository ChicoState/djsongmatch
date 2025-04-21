import {
  Sheet,
  SheetContent,
  SheetHeader,
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
      <SheetContent side="right" className='p-6'>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <DarkModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
