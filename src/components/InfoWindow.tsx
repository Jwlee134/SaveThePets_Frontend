import Image from "next/image";

export default function InfoWindow() {
  return (
    <>
      <div className="relative aspect-[3/2]">
        <Image src="/sample.png" alt="sample" fill className="object-cover" />
      </div>
      <div className="py-1 px-2">
        <h1>Title</h1>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden">
          content1
        </p>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden">
          content2
        </p>
      </div>
    </>
  );
}
