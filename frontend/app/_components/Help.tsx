"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Help() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>Help</Button>
            {isOpen && (
                <>
                    {/* Dimmed Background Overlay */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />

                    {/* Modal Content */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-2xl mx-auto p-6 border rounded-md shadow-md bg-background text-foreground border-border">
                        <Button
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 px-3 py-1 rounded-md hover:bg-muted cursor-pointer"
                        >
                            Close Help
                        </Button>

                        <h1 className="text-2xl font-bold mb-4">Help & Instructions</h1>
                        <p>Welcome to the DJ Song Match Help Page!</p>
                        <ul className="list-disc pl-5 mt-3">
                            <li>Search for songs using the search bar.</li>
                            <li>Move the sliders to adjust levels to designated levels.</li>
                            <li>Click "Generate" to see matching songs.</li>
                            <li>Use "Export" to save your song recommendations.</li>
                        </ul>
                    </div>
                </>
            )}
        </>
    );
}
