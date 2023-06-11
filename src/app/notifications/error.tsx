"use client";

import ErrorTemplate from "@/components/ErrorTemplate";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorTemplate error={error} reset={reset} />;
}
