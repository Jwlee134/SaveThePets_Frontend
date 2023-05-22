"use client";

import usePersistStore from "@/libs/store/usePersistStore";
import { IoGridOutline, IoMapOutline } from "react-icons/io5";
import { shallow } from "zustand/shallow";

export default function HomeViewToggleButton() {
  const { opt, setOpt } = usePersistStore(
    (state) => ({ opt: state.homeViewOpt, setOpt: state.setHomeViewOpt }),
    shallow
  );

  function onClick() {
    setOpt(opt === "map" ? "grid" : "map");
  }

  return (
    <button onClick={onClick} className="text-xl">
      {opt === "map" ? <IoGridOutline /> : <IoMapOutline />}
    </button>
  );
}
