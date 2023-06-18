import { deletePost, getPostDetail } from "@/libs/api";
import useIsReady from "@/libs/hooks/useIsReady";
import useMe from "@/libs/hooks/useMe";
import usePersistStore from "@/libs/store/usePersistStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown, Modal, message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

export default function PostDropdown() {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const isReady = useIsReady();
  const { data } = useQuery({
    queryFn: getPostDetail,
    queryKey: ["posts", id],
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: () => deletePost(id),
    useErrorBoundary: true,
    onSuccess() {
      message.success({ content: "게시글이 삭제되었습니다." });
      router.back();
    },
    onSettled: handleClose,
  });
  const me = useMe();

  function showModal() {
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
  }

  function handleEditClick() {
    if (!data) return;
    router.push(`/posts/${id}/edit?type=${data.type}`);
  }

  if (!isReady || !isLoggedIn) return null;
  return (
    <>
      <Dropdown
        menu={{
          items: [
            ...(me?.userId === data?.userid
              ? [
                  {
                    label: "수정",
                    key: "0",
                    onClick: handleEditClick,
                  },
                  {
                    label: "삭제",
                    key: "1",
                    onClick: showModal,
                  },
                ]
              : []),
            {
              label: "신고",
              key: "2",
              onClick: () => router.push(`/posts/${id}/report`),
            },
          ],
        }}
      >
        <IoMenuOutline />
      </Dropdown>
      <Modal
        title="정말 삭제하시겠습니까?"
        open={isModalOpen}
        onOk={() => mutate()}
        onCancel={handleClose}
        okText="삭제"
        okType="danger"
        cancelText="취소"
        confirmLoading={isLoading}
      >
        <p>이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </>
  );
}
