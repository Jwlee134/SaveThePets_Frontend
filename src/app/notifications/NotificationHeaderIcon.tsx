"use client";

import { getNotifications } from "@/libs/api/test";
import useBoundStore from "@/libs/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { shallow } from "zustand/shallow";

export default function NotificationHeaderIcon() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select(data) {
      return data.map((item) => item.id);
    },
  });
  const { isEmpty, isDeleteMode, setIsEmpty, toggleDeleteMode } = useBoundStore(
    ({ notification }) => ({
      isEmpty: notification.isEmpty,
      isDeleteMode: notification.isDeleteMode,
      setIsEmpty: notification.setIsEmpty,
      toggleDeleteMode: notification.toggleDeleteMode,
    }),
    shallow
  );

  function onDeleteAllClick() {
    Modal.confirm({
      title: "전체 삭제하시겠어요?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        toggleDeleteMode();
        setIsEmpty(true);
      },
    });
  }

  if (isEmpty) return null;
  return (
    <div className="flex items-center">
      {isDeleteMode ? (
        <>
          <Button type="text" size="small" onClick={toggleDeleteMode}>
            완료
          </Button>
          <Button type="text" size="small" danger onClick={onDeleteAllClick}>
            전체 삭제
          </Button>
        </>
      ) : (
        <button onClick={toggleDeleteMode}>
          <IoTrashOutline className="text-lg" />
        </button>
      )}
    </div>
  );
}
