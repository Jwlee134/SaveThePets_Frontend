"use client";

import Supported from "./Supported";
import NotSupported from "./NotSupported";
import { useLayoutEffect, useState } from "react";
import useIsReady from "@/libs/hooks/useIsReady";

export default function Page() {
  const isReady = useIsReady();
  const [supported, setSupported] = useState(true);

  useLayoutEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window))
      setSupported(false);
  }, []);

  if (!isReady) return null;
  if (supported) return <Supported />;
  return <NotSupported />;
}
