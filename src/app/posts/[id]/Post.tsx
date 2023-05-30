"use client";

import Carousel from "@/components/Carousel";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/libs/api/test";
import PostDropdown from "./PostDropdown";
import PostInteractions from "./PostInteractions";
import Timeline from "./Timeline";

export default function Post({ params: { id = "" } = {} }) {
  const { data, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    suspense: true,
  });

  return (
    <>
      <Carousel />
      <div className="px-6">
        <div className="flex items-center justify-between text-lg py-4">
          <PostInteractions />
          <PostDropdown />
        </div>
        <p className="break-all font-light">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <Timeline />
      </div>
    </>
  );
}
