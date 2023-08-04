"use client";

import { useQuery } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { getPostDetail } from "@/libs/api";
import { breeds } from "@/libs/constants";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
  });

  return (
    <>
      <div className="p-4">
        <div>{data && breeds[data.species][data.breed]}</div>
        <div>{data && data.content}</div>
      </div>
      <CommentForm />
      <ul className="p-4 space-y-6">
        <AnimatePresence>
          {data &&
            data.comments.map((comment) => (
              <Comment key={comment.commentId} {...comment} />
            ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
