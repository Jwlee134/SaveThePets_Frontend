"use client";

import GridItem from "@/components/GridItem";
import { getBookmarks } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export default function MyBookmarks() {
  const { data } = useQuery({
    queryKey: ["me", "bookmarks"],
    queryFn: getBookmarks,
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
