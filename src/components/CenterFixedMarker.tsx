import { IoLocation } from "react-icons/io5";

export default function CenterFixedMarker() {
  return (
    <IoLocation
      pointerEvents="none"
      className="absolute w-9 h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-[28px] z-50"
    />
  );
}
