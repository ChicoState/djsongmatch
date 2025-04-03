"use client";

export default function HelpPage({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-md shadow-md bg-white relative">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">
        Close Help
      </button>

      <h1 className="text-2xl font-bold mb-4">Help & Instructions</h1>
      <p>Welcome to the DJ Song Match Help Page!</p>
      <ul className="list-disc pl-5 mt-3">
        <li>Search for songs using the search bar.</li>
        <li>Move the sliders to adjust levels to designated levels.</li>
        <li>Click "Generate" to see matching songs.</li>
        <li>Use "Export" to add custom music files.</li>
      </ul>
    </div>
  );
}
