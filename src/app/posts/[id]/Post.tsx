"use client";

import Carousel from "@/components/Carousel";
import { useQuery } from "@tanstack/react-query";
import PostDropdown from "./PostDropdown";
import PostInteractions from "./PostInteractions";
import Timeline from "./Timeline";
import { getPostDetail } from "@/libs/api";

export default function Post({ params: { id = "" } = {} }) {
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    suspense: true,
    useErrorBoundary: true,
  });

  return (
    <>
      <Carousel />
      <div className="px-6">
        <div className="flex items-center justify-between text-lg py-4">
          <PostInteractions />
          <PostDropdown />
        </div>
        <p className="break-all font-light">{data?.content}</p>
        <Timeline />
      </div>
    </>
  );
}
