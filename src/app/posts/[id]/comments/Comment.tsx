import Image from "next/image";
import CommentDropdown from "./CommentDropdown";
import { CommentResponse } from "@/libs/api/types";
import { formatCreatedAt } from "@/libs/utils";

export default function Comment({
  picture,
  nickname,
  timestamp,
  content,
  commentId,
}: CommentResponse) {
  return (
    <>
      <div className="flex">
        <div className="relative overflow-hidden rounded-full w-14 h-14 mr-4 shrink-0">
          <Image src={picture} alt="Profile" fill className="object-cover" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {nickname}{" "}
              <span className="text-xs text-gray-500">
                • {formatCreatedAt(timestamp)}
              </span>
            </div>
            <CommentDropdown id={commentId} content={content} />
          </div>
          <p className="text-sm font-light mt-2">{content}</p>
        </div>
      </div>
    </>
  );
}
