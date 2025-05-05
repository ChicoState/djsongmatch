import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import Help from "./Help";

function Settings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background text-foreground" align="end">
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Log in</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TopNav() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 font-semibold border-b border-border">
        <h1 className="text-3xl">DJ Song Match TEST</h1>
        <div className="flex gap-4 items-center">
          <DarkModeToggle />
          <Help />
          <Button variant="outline">Export</Button>
          <Settings />
        </div>
      </nav>
    </div>
  );
}
    // {/* Render Help Page if showHelp is true */}
    // {showHelp && (
    //   <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    //       <HelpPage onClose={() => setShowHelp(false)} />
    //     </div>
    // )}