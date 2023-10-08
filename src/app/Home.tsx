"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import Grid from "@/components/Grid";
import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const isReady = useIsReady();
  const opt = usePersistStore((state) => state.viewOpts.homeViewOpt);

  if (!isReady) return null;
  if (opt === "map") return <Map />;
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Grid />
    </Suspense>
  );
}
