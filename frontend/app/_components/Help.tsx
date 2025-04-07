"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Help() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(!isOpen)}>Help</Button>
            {isOpen && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 max-w-2xl mx-auto p-6 border border-gray-300 rounded-md shadow-md bg-white">
                    {/* Close Button */}
                    <Button variant="secondary" onClick={() => setIsOpen(false)} className="absolute top-4 right-4 px-3 py-1 rounded-md hover:bg-gray-300">
                        Close Help
                    </Button>

                    <h1 className="text-2xl font-bold mb-4">Help & Instructions</h1>
                    <p>Welcome to the DJ Song Match Help Page!</p>
                    <ul className="list-disc pl-5 mt-3">
                        <li>Search for songs using the search bar.</li>
                        <li>Move the sliders to adjust levels to designated levels.</li>
                        <li>Click "Generate" to see matching songs.</li>
                        <li>Use "Export" to add custom music files.</li>
                    </ul>
                </div>)}
    </>
    );
}
