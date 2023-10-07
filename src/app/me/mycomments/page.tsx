/* eslint-disable @next/next/no-img-element */
"use client";

import { getMyComments } from "@/libs/api";
import { breeds } from "@/libs/constants";
import { convertFromType, formatTime } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function MyComments() {
  const { data } = useQuery({
    queryKey: ["me", "comments"],
    queryFn: getMyComments,
    useErrorBoundary: true,
  });

  return (
    <div className="p-3 space-y-3">
      {data?.map((item, i) => (
        <Link key={i} href={`/posts/${item.postId}/comments`} className="flex">
          <div className="relative w-40 aspect-square rounded-md overflow-hidden shrink-0">
            <img
              src={item.picture}
              alt="sample"
              className="object-cover absolute inset-0 w-full h-full"
            />
            {item.type !== undefined && (
              <div className="absolute text-white backdrop-blur-xl w-full bottom-0 font-light text-sm h-6 grid place-items-center">
                {convertFromType(item.type)}
              </div>
            )}
          </div>
          <div className="pl-2">
            <div className="py-1">
              <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl">
                {breeds[item.species][item.breed]}
              </h1>
            </div>
            <div className="font-light text-sm break-all line-clamp-6">
              {item.content}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
