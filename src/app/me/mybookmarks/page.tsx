"use client";

import { getBookmarks } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export default function MyBookmarks() {
  const { data } = useQuery({
    queryKey: ["me", "bookmarks"],
    queryFn: getBookmarks,
    suspense: true,
    useErrorBoundary: true,
  });

  return <div></div>;
}
