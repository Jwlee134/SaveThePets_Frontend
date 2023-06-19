"use client";

import Carousel from "@/components/Carousel";
import { useQuery } from "@tanstack/react-query";
import PostDropdown from "./PostDropdown";
import PostInteractions from "./PostInteractions";
import Timeline from "./Timeline";
import { getPostDetail } from "@/libs/api";
import { useParams } from "next/navigation";

export default function Post() {
  const params = useParams();
  const { data } = useQuery({
    queryKey: ["posts", params.id],
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
        {data?.type === 0 && <Timeline />}
      </div>
    </>
  );
}
