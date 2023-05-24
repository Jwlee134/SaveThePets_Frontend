"use client";

import Grid from "@/components/Grid";
import Map from "@/components/Map";
import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";

export default function Home() {
  const isReady = useIsReady();
  const opt = usePersistStore((state) => state.viewOpts.homeViewOpt);

  if (!isReady) return null;
  if (opt === "map") return <Map />;
  return <Grid />;
}
