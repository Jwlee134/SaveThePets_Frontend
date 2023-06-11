import Spinner from "./Spinner";

export default function FullScreenLoader() {
  return (
    <div className="h-[var(--fit-screen)] grid place-items-center">
      <Spinner size="lg" />
    </div>
  );
}
