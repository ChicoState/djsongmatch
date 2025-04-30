"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SongWithUuid, cn } from "@/lib/utils";
import { DndContext, type DragEndEvent, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleMinusIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import TitleArtist from "./TitleArtist";
import TrashConfirm from "./TrashConfirm";
import { usePlaylist } from "@/lib/hooks";

function SortableSongRow({
  song,
  index,
  removeSong,
}: {
  song: SongWithUuid;
  index: number;
  removeSong: (song: SongWithUuid) => void;
}) {
  /**
   * A row in the Playlist table that can be reordered by dragging it.
   */

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: song.uuid,
    });

  /* Visually indicate that the row is being dragged */
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow className="text-lg" style={style}>
      <TableCell
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="w-16 cursor-grab"
      >
        <div className="flex justify-center items-center h-full">
          <GripVerticalIcon className="cursor-grab" />
        </div>
      </TableCell>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell>
        <TitleArtist title={song.title} artist={song.artist} />
      </TableCell>
      <TableCell className="text-right">{song.camelotKeyStr}</TableCell>
      <TableCell className="text-right">{Math.round(song.tempo)}</TableCell>
      <TableCell className="pr-4 pl-6">
        <Tooltip disableHoverableContent={true}>
          <TooltipTrigger>
            <CircleMinusIcon
              onMouseDown={() => removeSong(song)}
              className="transition-all duration-200 cursor-pointer hover:scale-110 text-destructive hover:text-destructive/80"
            />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8}>
            <p className="text-lg">Remove from playlist</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default function PlaylistTable() {
  /* Which songs are in the playlist */
  const { playlist, setPlaylist } = usePlaylist();
  const [showConfirm, setShowConfirm] = useState(false);
  const TableContainerRef = useRef<HTMLDivElement>(null);
  const prevPlaylistLengthRef = useRef(playlist.length);

  const removeSong = useCallback(
    (song: SongWithUuid) => {
      setPlaylist(playlist.filter((s) => s.uuid !== song.uuid));
    },
    [playlist, setPlaylist],
  );

  /* Use useCallback to memoize the handleDragEnd function */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      /**
       * handleDragEnd() is called when a song row is dragged to a new position in the playlist.
       * It updates the playlist in React with the new order.
       */
      const { active, over } = event;

      if (over === null || active.id === over.id) return;
      setPlaylist((songs) => {
        const originalIdx = songs.findIndex((s) => s.uuid === active.id);
        const newIdx = songs.findIndex((s) => s.uuid === over.id);
        return arrayMove(songs, originalIdx, newIdx);
      });
    },
    [setPlaylist],
  );

  /* Scroll to the bottom when a song is added (playlist length increases) */
  useEffect(() => {
    if (playlist.length > prevPlaylistLengthRef.current) {
      TableContainerRef.current?.scrollTo(
        0,
        TableContainerRef.current?.scrollHeight,
      );
    }
    prevPlaylistLengthRef.current = playlist.length;
  }, [playlist]);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center w-full transition-opacity duration-300 h-192",
        playlist.length === 0 && "opacity-25",
      )}
    >
      <div className="flex items-center w-full">
        <h2 className="flex-1 text-2xl text-center">Your Playlist</h2>
      </div>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext
          items={playlist.map((song) => song.uuid)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            refTableContainer={TableContainerRef}
            className="border border-border"
          >
            <TableHeader className="relative">
              <TableRow className="sticky top-0 text-xl text-secondary-foreground bg-secondary hover:bg-secondary">
                <TableHead className="font-bold"></TableHead>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="font-bold">Track</TableHead>
                <TableHead className="font-bold text-right">Key</TableHead>
                <TableHead className="font-bold text-right">BPM</TableHead>
                <TableHead className="pr-4 pl-6 w-[16px]">
                  {playlist.length > 0 && (
                    <Tooltip disableHoverableContent={true}>
                      <TooltipTrigger>
                        <TrashIcon
                          onMouseDown={() => setShowConfirm(true)}
                          className="transition-all duration-200 cursor-pointer hover:scale-110 text-destructive hover:text-destructive/80"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={8}>
                        <p className="text-lg">Clear playlist</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlist.map((song, index) => {
                return (
                  <SortableSongRow
                    key={song.uuid}
                    song={song}
                    index={index}
                    removeSong={removeSong}
                  />
                );
              })}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      <TrashConfirm
        open={showConfirm}
        onConfirm={() => {
          setPlaylist([]);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
