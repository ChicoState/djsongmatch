"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Help() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        Help
      </Button>
      {isOpen && (
        <>
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            Help
          </Button>
          {isOpen && (
            <>
              {/* Dimmed Background Overlay */}
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* Modal Content */}
              <div className="fixed top-1/2 left-1/2 z-50 p-6 mx-auto max-w-2xl rounded-md border shadow-md transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground border-border">
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 py-1 px-3 rounded-md cursor-pointer hover:bg-muted"
                >
                  Close Help
                </Button>

                <h1 className="mb-4 text-2xl font-bold">Help & Instructions</h1>
                <p>Welcome to the DJ Song Match Help Page!</p>
                <ul className="pl-5 mt-3 list-disc">
                  <li>Search for songs using the search bar.</li>
                  <li>
                    Move the sliders to adjust levels to designated levels.
                  </li>
                  <li>Click &quot;Generate&quot; to see matching songs.</li>
                  <li>
                    Use &quot;Export&quot; to save your song recommendations.
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
