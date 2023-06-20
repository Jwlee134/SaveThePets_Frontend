"use client";

import { getMyPosts } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export default function MyPosts() {
  const { data } = useQuery({
    queryKey: ["me", "posts"],
    queryFn: getMyPosts,
    suspense: true,
    useErrorBoundary: true,
  });

  return <div></div>;
}
