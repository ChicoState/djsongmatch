
"use client";

import { Button } from "@/components/ui/button";
import Help from "./Help";
import SettingsDrawer from "./SettingsDrawer";
import { useRouter } from "next/navigation"


export default function TopNav() {
  const router = useRouter();

  return (
    <div>
      <nav className="flex justify-between items-center p-4 font-semibold">
        <h1 className="text-3xl">DJ Song Match</h1>
        <div className="flex gap-4 items-center">
          <Button variant="default">Export</Button>
          <Help />
          <Button variant="outline" onClick={() => router.push("/login")}>
            Log in
          </Button>
          <SettingsDrawer />
        </div>
      </nav>
    </div>
  );
}

