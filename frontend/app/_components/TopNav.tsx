import { Button } from "@/components/ui/button";
import Help from "./Help";
import SettingsDrawer from "./SettingsDrawer"; // import the drawer

export default function TopNav() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 font-semibold border-b border-border">
        <h1 className="text-3xl">DJ Song Match</h1>
        <div className="flex gap-4 items-center">
          <Button variant="default">Export</Button>
          <Help />
          <Button variant="outline">Log in</Button>
          <SettingsDrawer />
        </div>
      </nav>
    </div>
  );
}

