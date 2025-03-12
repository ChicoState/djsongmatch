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
      <div className="flex flex-row gap-24">
        {/* Left side content */}
        <div className="w-full shrink-[3]">
          <SongForm onFetchDataAction={setTableData} />
        </div>
        {/* Right side content */}
        <div className="w-full shrink-[1]">
          <SongTable songs={tableData} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
