import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import Help from "./Help";

export default function TopNav() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 font-semibold border-b border-border">
        <h1 className="text-3xl">DJ Song Match</h1>
        <div className="flex gap-4 items-center">
          <DarkModeToggle />
          <Help />
          <Button variant="outline">Export</Button>
          <Button variant="outline">Settings</Button>
          <Button variant="outline">Log in</Button>
        </div>
      </nav>
    </div>
  );
}
