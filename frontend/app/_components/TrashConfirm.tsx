"use client";

import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({
    open,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;

    return (
        <>
        {/* Overlay */}
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onCancel}
        />

        {/* Modal */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full p-6 border rounded-md shadow-md bg-background text-foreground border-border">
            <h2 className="text-2xl font-bold mb-4">Delete Playlist?</h2>
            <p className="mb-6">Are you sure you want to delete your whole playlist?</p>

            <div className="flex justify-end gap-3">
            <Button
                variant="ghost"
                onClick={onCancel}
                className="cursor-pointer"
            >
                Cancel
            </Button>
            <Button
                variant="destructive"
                onClick={onConfirm}
                className="cursor-pointer"
            >
                Delete
            </Button>
            </div>
        </div>
        </>
    );
}
