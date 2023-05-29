import { cls } from "@/libs/utils";
import { IoAlertCircle } from "react-icons/io5";

export default function TimelineMarker({
  index,
  sm = false,
}: {
  index: number;
  sm?: boolean;
}) {
  if (index === 0) {
    return (
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute w-6 h-6 rounded-full bg-white top-1/2 left-1/2 -translate-x-[14px] -translate-y-[14px]" />
        <IoAlertCircle className="text-4xl text-red-500 drop-shadow-md" />
      </div>
    );
  }
  return (
    <div
      className={cls(
        "rounded-full bg-orange-400 flex items-center justify-center text-white shadow-md",
        sm ? "w-5 h-5" : "w-7 h-7"
      )}
    >
      {index}
    </div>
  );
}
