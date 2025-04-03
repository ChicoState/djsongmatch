"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import HelpPage from "@/components/ui/help"; 

function Settings({ toggleHelp }: { toggleHelp: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background text-foreground" align="end">
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleHelp}>Help</DropdownMenuItem>
        <DropdownMenuItem>Log in</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TopNav() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 font-semibold border-b border-border">
        <h1 className="text-3xl">DJ Song Match</h1>
        <div className="flex gap-4 items-center">
          <DarkModeToggle />
          <Button variant="outline">Export</Button>
          <Settings toggleHelp={() => setShowHelp((prev) => !prev)} />
        </div>
      </nav>

      {/* Render Help Page if showHelp is true */}
      {showHelp && (
        <div className="p-4">
          <HelpPage onClose={() => setShowHelp(false)} />
        </div>
      )}
    </div>
  );
}
