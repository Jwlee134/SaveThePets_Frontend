import { useLayoutEffect, useState } from "react";

export default function useIsReady() {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  return ready;
}
