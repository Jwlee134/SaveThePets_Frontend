"use client";

import { useQuery } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { getPostDetail } from "@/libs/api";
import { breeds } from "@/libs/constants";

export default function Page({ params: { id = "" } = {} }) {
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    suspense: true,
  });

  return (
    <>
      <div className="p-4">
        <div>{data && breeds[data.species][data.breed]}</div>
        <div>{data && data.content}</div>
      </div>
      <CommentForm />
      <div className="p-4 space-y-6">
        {data?.comments?.map((comment) => (
          <Comment key={comment.commentId} {...comment} />
        ))}
      </div>
    </>
  );
}
