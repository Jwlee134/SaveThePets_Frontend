export default function TimelineMarker({ index }: { index: number }) {
  return (
    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white shadow-md">
      {index}
    </div>
  );
}
