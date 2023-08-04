"use client";

import { getMyComments } from "@/libs/api";
import { convertFromType } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function MyComments() {
  const { data } = useQuery({
    queryKey: ["me", "comments"],
    queryFn: getMyComments,
    useErrorBoundary: true,
  });

  return (
    <div>
      {data?.map((item, i) => (
        <Link key={i} href={`/posts/${item.postId}/comments`}>
          <div className="relative aspect-square">
            <Image
              src={item.picture}
              alt="sample"
              fill
              className="object-cover"
            />
            {item.type !== undefined && (
              <div className="absolute text-white backdrop-blur-xl w-full bottom-0 font-light text-sm h-6 grid place-items-center">
                {convertFromType(item.type)}
              </div>
            )}
          </div>
          {/* <div className="py-1 px-2">
        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap">
          {breeds[species][breed]}
        </h1>
        <p className="text-gray-500 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
          {formatTime(time)}
        </p>
      </div> */}
        </Link>
      ))}
    </div>
  );
}
