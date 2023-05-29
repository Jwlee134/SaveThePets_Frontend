import Image from "next/image";

export default function Marker({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="thumbnail"
      width={72}
      height={72}
      className="rounded-full border-white border-4 shadow-lg"
    />
  );
}
