"use client";

import { useQuery } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import { getPostDetail } from "@/libs/api/test";
import Comment from "./Comment";

export default function Page({ params: { id = "" } = {} }) {
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    suspense: true,
  });

  return (
    <>
      <div className="p-4">
        <div>{data ? "Title" : ""}</div>
        <div>
          {data
            ? `Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.`
            : ""}
        </div>
      </div>
      <CommentForm />
      <div className="p-4 space-y-6">
        {Array(10)
          .fill(0)
          .map((v, i) => (
            <Comment key={i} />
          ))}
      </div>
    </>
  );
}
