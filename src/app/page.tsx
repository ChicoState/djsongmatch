"use client";
import "./globals.css";
import SongForm from "@/components/ui/SongForm";
import SongTable from "@/components/ui/songtable";
import { Song } from "@/db/schema";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

export default function Home() {
  const [tableData, setTableData] = useState<Song[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-row gap-24 h-full">
        {/* Left side content */}
        <SongForm onFetchDataAction={setTableData} />
        {/* Right side content */}
        <div className="h-full grow-[4]">
          <SongTable songs={tableData} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
