import useIsReady from "@/libs/hooks/useIsReady";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { Dropdown, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";

export default function CommentDropdown() {
  const value = `Lorem Ipsum is simply dummy text of the printing and typesetting
  industry. Lorem Ipsum has been the industry's standard dummy text ever
  since the 1500s, when an unknown printer took a galley of type and
  scrambled it to make a type specimen book.`;
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const enableEditMode = useBoundStore(({ comment }) => comment.enableEditMode);
  const isReady = useIsReady();

  function showModal() {
    setIsModalOpen(true);
  }

  async function handleOk() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  if (!isLoggedIn || !isReady) return null;
  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              label: "수정",
              key: "0",
              onClick: () => enableEditMode({ id: 1, value }),
            },
            {
              label: "삭제",
              key: "1",
              onClick: showModal,
            },
            {
              label: "신고",
              key: "2",
              onClick: () =>
                router.push(`/posts/${params.id}/comments/1/report`),
            },
          ],
        }}
      >
        <IoIosMore />
      </Dropdown>
      <Modal
        title="정말 삭제하시겠습니까?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="삭제"
        okType="danger"
        cancelText="취소"
      >
        <p>이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </>
  );
}
