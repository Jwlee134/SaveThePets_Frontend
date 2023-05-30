import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export function PrevBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 left-1 text-3xl text-white drop-shadow"
      onClick={onClick}
    >
      <IoChevronBack />
    </button>
  );
}

export function NextBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 right-1 text-3xl text-white drop-shadow"
      onClick={onClick}
    >
      <IoChevronForward />
    </button>
  );
}

export function Indicator({
  index,
  length,
}: {
  index: number;
  length: number;
}) {
  return (
    <div className="absolute bottom-2 right-2 text-gray-200 bg-black bg-opacity-50 py-1 px-2 text-xs font-bold rounded-xl">
      {index} / {length}
    </div>
  );
}
