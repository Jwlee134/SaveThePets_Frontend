import Image from "next/image";

export default function Marker() {
  return (
    <Image
      src="/sample.png"
      alt="sample"
      width={72}
      height={72}
      className="rounded-full border-white border-4 shadow-lg"
    />
  );
}
