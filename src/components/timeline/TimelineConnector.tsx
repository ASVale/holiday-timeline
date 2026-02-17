export default function TimelineConnector() {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="absolute h-full w-0.5 bg-gradient-to-b from-accent/50 via-accent/30 to-accent/20" />
      <div className="relative bg-accent rounded-full w-3 h-3 border-2 border-background shadow-lg shadow-accent/20" />
    </div>
  );
}
