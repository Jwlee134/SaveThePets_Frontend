import Image from "next/image";
import Link from "next/link";
import { breeds } from "@/libs/constants";
import { convertFromType, formatTime } from "@/libs/utils";

export interface InfoWindowProps {
  id: number;
  picture: string;
  species: number;
  breed: number;
  time: string;
  type?: number;
}

export default function InfoWindow({
  id,
  picture,
  species,
  breed,
  time,
  type,
}: InfoWindowProps) {
  return (
    <Link href={`/posts/${id}`}>
      <div className="relative aspect-[4/3]">
        <Image
          src={picture}
          alt={id.toString()}
          fill
          className="object-cover"
        />
        {type !== undefined && (
          <div className="absolute text-white backdrop-blur-xl w-full bottom-0 font-light text-sm h-6 grid place-items-center">
            {convertFromType(type)}
          </div>
        )}
      </div>
      <div className="py-1 px-2">
        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap">
          {breeds[species][breed]}
        </h1>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
          {formatTime(time)}
        </p>
      </div>
    </Link>
  );
}
