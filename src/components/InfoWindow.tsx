import Image from "next/image";
import Link from "next/link";
import { breeds } from "@/libs/constants";
import { formatTime } from "@/libs/utils";

export interface InfoWindowProps {
  id: number;
  picture: string;
  species: number;
  breed: number;
  address: string;
  time: string;
}

export default function InfoWindow({
  id,
  picture,
  species,
  breed,
  address,
  time,
}: InfoWindowProps) {
  return (
    <Link href={`/posts/${id}`}>
      <div className="relative aspect-[3/2]">
        <Image src={picture} alt="sample" fill className="object-cover" />
      </div>
      <div className="py-1 px-2">
        <h1>{breeds[species][breed]}</h1>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden">
          {address}
        </p>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden">
          {formatTime(time)}
        </p>
      </div>
    </Link>
  );
}
