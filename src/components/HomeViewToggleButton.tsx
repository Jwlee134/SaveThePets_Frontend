"use client";

import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";
import { IoGridOutline, IoMapOutline } from "react-icons/io5";
import { shallow } from "zustand/shallow";

export default function HomeViewToggleButton() {
  const isReady = useIsReady();
  const { opt, setOpt } = usePersistStore(
    (state) => ({
      opt: state.viewOpts.homeViewOpt,
      setOpt: state.setHomeViewOpt,
    }),
    shallow
  );

  function onClick() {
    setOpt(opt === "map" ? "grid" : "map");
  }

  if (!isReady) return null;
  return (
    <button onClick={onClick} className="text-xl">
      {opt === "map" ? <IoGridOutline /> : <IoMapOutline />}
    </button>
  );
}
