import CommentDropdown from "./CommentDropdown";
import { CommentResponse } from "@/libs/api/types";
import { formatCreatedAt } from "@/libs/utils";
import { Avatar } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { motion } from "framer-motion";

export default function Comment({
  picture,
  nickname,
  timestamp,
  content,
  commentId,
}: CommentResponse) {
  return (
    <motion.li
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="flex bg-white"
    >
      <div className="mr-4 shrink-0">
        <Avatar
          size={56}
          icon={<AiOutlineUser className="text-3xl" />}
          src={picture}
          className="object-cover grid place-items-center"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {nickname || "Anonymous"}{" "}
            <span className="text-xs text-gray-500">
              • {formatCreatedAt(timestamp)}
            </span>
          </div>
          <CommentDropdown id={commentId} content={content} />
        </div>
        <p className="text-sm font-light mt-1">{content}</p>
      </div>
    </motion.li>
  );
}
