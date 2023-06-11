import useBoundStore from "@/libs/store";
import { createNotificationText, formatCreatedAt } from "@/libs/utils";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { NotificationResponse } from "@/libs/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNotification, getNotifications } from "@/libs/api";
import Link from "next/link";
import { breeds } from "@/libs/constants";

export default function NotificationItem({
  timestamp,
  type,
  breed,
  nickname,
  species,
  alarmId,
  postId,
}: NotificationResponse) {
  const queryClient = useQueryClient();
  const isDeleteMode = useBoundStore(
    ({ notification }) => notification.isDeleteMode
  );
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  const { mutate } = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (id) => {
      const prevData: NotificationResponse[] | undefined =
        queryClient.getQueryData(["notifications"]);
      if (!prevData) return;
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const newData: NotificationResponse[] = data?.filter(
        (item) => item.alarmId !== id
      )!;
      queryClient.setQueryData(["notifications"], newData);
      return { prevData, newData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["notifications"], context?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    useErrorBoundary: true,
  });

  function onDeleteClick() {
    mutate(alarmId);
  }

  return (
    <Link href={nickname ? `/posts/${postId}/comments` : `/posts/${postId}`}>
      <motion.div
        className="flex relative"
        animate={{ translateX: isDeleteMode ? -48 : 0 }}
      >
        <div className="shrink-0 mr-3">
          <Image
            width={64}
            height={64}
            src="/sample.png"
            alt="thumbnail"
            className="object-cover rounded-full"
          />
        </div>
        <p className="text-sm">
          {createNotificationText(type, {
            breed: breeds[species][breed],
            nickname,
          })}
          <span className="ml-2 text-gray-500 whitespace-nowrap">
            {formatCreatedAt(timestamp)}
          </span>
        </p>
        <motion.button
          initial={false}
          animate={{ opacity: isDeleteMode ? 1 : 0 }}
          className="absolute w-12 h-full grid place-items-center -right-12"
          onClick={onDeleteClick}
          disabled={!isDeleteMode}
        >
          <IoTrashOutline className="text-lg text-red-500" />
        </motion.button>
      </motion.div>
    </Link>
  );
}
