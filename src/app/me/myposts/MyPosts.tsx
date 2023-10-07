"use client";

import GridItem from "@/components/GridItem";
import { getMyPosts } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export default function MyPosts() {
  const { data } = useQuery({
    queryKey: ["me", "posts"],
    queryFn: getMyPosts,
    useErrorBoundary: true,
  });

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {data?.map((item) => (
        <GridItem key={item.postId} {...item} />
      ))}
    </div>
  );
}
