"use client";

import Supported from "./Supported";
import NotSupported from "./NotSupported";
import { useLayoutEffect, useState } from "react";

export default function Notifications() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window)
      setSupported(true);
    else setSupported(false);
  }, []);

  if (supported === null) return null;
  if (supported) return <Supported />;
  return <NotSupported />;
}
