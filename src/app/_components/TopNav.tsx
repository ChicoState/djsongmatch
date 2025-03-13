import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

function Settings() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-background text-foreground"
          align="end"
        >
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Help</DropdownMenuItem>
          <DropdownMenuItem>Log In</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function TopNav() {
  return (
    <nav className="flex justify-between items-center p-4 font-semibold border-b-4">
      <div className="flex items-center">
        <h1 className="text-3xl">DJ Song Match</h1>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="outline">Export</Button>
        <Settings />
      </div>
    </nav>
  );
}
