export default function Loading() {
  return (
    <>
      <div className="bg-black/[0.06] w-full aspect-square"></div>
      <div className="p-6 space-y-3">
        {Array(5)
          .fill(0)
          .map((v, i) => (
            <div key={i} className="bg-black/[0.06] w-full h-4 rounded" />
          ))}
      </div>
    </>
  );
}
