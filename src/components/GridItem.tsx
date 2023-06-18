import { PostResponse } from "@/libs/api/types";
import Image from "next/image";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { breeds } from "@/libs/constants";
import { convertFromType, formatTime } from "@/libs/utils";
import Link from "next/link";

export default function GridItem({
  picture,
  breed,
  species,
  address,
  time,
  postId,
  type,
}: PostResponse) {
  return (
    <Link href={`/posts/${postId}`}>
      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image src={picture} alt="thumbnail" fill className="object-cover" />
        <div className="absolute text-white backdrop-blur-xl w-full bottom-0 font-light text-sm h-6 grid place-items-center">
          {convertFromType(type)}
        </div>
      </div>
      <h3 className="my-1">{breeds[species][breed]}</h3>
      <div className="flex items-center">
        <IoLocationOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm whitespace-nowrap">
          {address}
        </p>
      </div>
      <div className="flex items-center">
        <IoTimeOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm whitespace-nowrap">
          {formatTime(time)}
        </p>
      </div>
    </Link>
  );
}
