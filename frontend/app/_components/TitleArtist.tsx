export default function TitleArtist({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-lg text-accent-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{artist}</div>
    </div>
  );
}
