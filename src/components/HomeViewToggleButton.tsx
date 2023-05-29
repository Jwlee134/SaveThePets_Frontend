"use client";

import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";
import { IoGridOutline, IoMapOutline } from "react-icons/io5";
import { shallow } from "zustand/shallow";

export default function HomeViewToggleButton() {
  const isReady = useIsReady();
  const { opt, toggle } = usePersistStore(
    (state) => ({
      opt: state.viewOpts.homeViewOpt,
      toggle: state.setHomeViewOpt,
    }),
    shallow
  );

  if (!isReady) return null;
  return (
    <button onClick={toggle} className="text-xl">
      {opt === "map" ? <IoGridOutline /> : <IoMapOutline />}
    </button>
  );
}
