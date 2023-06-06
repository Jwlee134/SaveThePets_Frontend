import useBoundStore from "@/libs/store";
import { formatCreatedAt } from "@/libs/utils";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationItem({
  date,
}: {
  id: string;
  date: string;
}) {
  const isDeleteMode = useBoundStore(
    ({ notification }) => notification.isDeleteMode
  );

  function onDeleteClick() {}

  return (
    <div className="flex">
      <div className="shrink-0 mr-3">
        <Image
          width={64}
          height={64}
          src="/sample.png"
          alt=""
          className="object-cover rounded-full"
        />
      </div>
      <p className="text-sm">
        포메라니안의 실종 위치 근처에 포메라니안으로 추정되는 동물이
        목격되었습니다. 클릭하여 확인해 보세요.
        <span className="ml-2 text-gray-500 whitespace-nowrap">
          {formatCreatedAt(date)}
        </span>
      </p>
      <AnimatePresence>
        {isDeleteMode && (
          <motion.button
            layout
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 40 }}
            exit={{ opacity: 0, width: 0 }}
            className="shrink-0 flex justify-center items-center"
            onClick={onDeleteClick}
          >
            <IoTrashOutline className="text-lg text-red-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
