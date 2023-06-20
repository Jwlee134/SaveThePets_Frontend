"use client";

import { getMyComments } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export default function MyComments() {
  const { data } = useQuery({
    queryKey: ["me", "comments"],
    queryFn: getMyComments,
    suspense: true,
    useErrorBoundary: true,
  });

  return <div></div>;
}
