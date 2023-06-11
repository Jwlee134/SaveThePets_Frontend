import { PostResponse } from "@/libs/api/types";
import Image from "next/image";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { breeds } from "@/libs/constants";
import { formatTime } from "@/libs/utils";

export default function GridItem({
  picture,
  breed,
  species,
  address,
  time,
}: PostResponse) {
  return (
    <div>
      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image src={picture} alt="thumbnail" fill className="object-cover" />
      </div>
      <h3 className="my-1">{breeds[species][breed]}</h3>
      <div className="flex items-center">
        <IoLocationOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm">{address}</p>
      </div>
      <div className="flex items-center">
        <IoTimeOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm">
          {formatTime(time)}
        </p>
      </div>
    </div>
  );
}
