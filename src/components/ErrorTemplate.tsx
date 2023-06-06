import { Button } from "antd";
import { useEffect } from "react";

export default function ErrorTemplate({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[var(--fit-screen)] flex flex-col justify-center items-center p-6">
      <h2 className="text-xl">에러 발생!</h2>
      <h3 className="mb-4 font-light">
        {error.message}
        {error.cause ? `: ${error.cause as string}` : ""}
      </h3>
      <Button onClick={() => reset()}>다시 시도</Button>
    </div>
  );
}
