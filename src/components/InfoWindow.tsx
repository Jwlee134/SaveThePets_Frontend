import Image from "next/image";
import Link from "next/link";

export default function InfoWindow({ id }: { id: string }) {
  return (
    <Link href={`/posts/${id}`}>
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
    </Link>
  );
}
