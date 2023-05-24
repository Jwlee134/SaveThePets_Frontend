"use client";

import Grid from "@/components/Grid";
import Map from "@/components/Map";
import usePersistStore from "@/libs/store/usePersistStore";

export default function Main() {
  const opt = usePersistStore((state) => state.viewOpts.homeViewOpt);

  if (opt === "map") return <Map />;
  return <Grid />;
}
