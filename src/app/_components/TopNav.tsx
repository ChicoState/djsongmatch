import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Settings() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>…</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-bg text-fg">
          <DropdownMenuItem className="text-lg">Settings</DropdownMenuItem>
          <DropdownMenuItem className="text-lg">Help</DropdownMenuItem>
          <DropdownMenuItem className="text-lg">Log In</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function TopNav() {
  return (
    <nav className="flex justify-between items-center py-4 px-8 w-full text-xl font-semibold text-bg bg-fg">
      <div className="flex gap-8 items-center">
        <h1 className="text-3xl">DJ Song Match</h1>
      </div>
      <div className="flex gap-12 items-center">
        <a>Export</a>
        <Settings />
      </div>
    </nav>
  );
}
