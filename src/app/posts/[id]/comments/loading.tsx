import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="h-[var(--fit-screen)] grid place-items-center">
      <Spinner size="lg" />
    </div>
  );
}
