"use client";

import { Button } from "@/components/ui/button";

export default function ExportButton() {
  const handleDownload = () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = "playlist.txt"; // Set the desired file name

    // Append to the body (necessary for some browsers)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the temporary link and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <Button variant="default" onClick={() => handleDownload()}>
      Export
    </Button>
  );
}
