import Image from "next/image";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";

export default function GridItem() {
  return (
    <div>
      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image src="/sample.png" alt="" fill className="object-cover" />
      </div>
      <h3 className="my-1">Title</h3>
      <div className="flex items-center">
        <IoLocationOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm">
          blablablablablablablablablabla
        </p>
      </div>
      <div className="flex items-center">
        <IoTimeOutline className="shrink-0 mr-1 text-lg" />
        <p className="overflow-hidden text-ellipsis text-sm">
          blablablablablablablablablabla
        </p>
      </div>
    </div>
  );
}
