"use client";

import usePersistStore from "@/libs/store/usePersistStore";
import LoginRequired from "@/components/LoginRequired";
import Me from "./Me";
import useIsReady from "@/libs/hooks/useIsReady";

export default function Page() {
  const isReady = useIsReady();
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);

  if (!isReady) return null;
  if (!isLoggedIn) return <LoginRequired />;
  return <Me />;
}
