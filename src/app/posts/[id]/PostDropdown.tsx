import { deletePost, getPostDetail } from "@/libs/api";
import useIsReady from "@/libs/hooks/useIsReady";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { convertFromType } from "@/libs/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown, Modal, message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

export default function PostDropdown() {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setValues = useBoundStore(({ postForm }) => postForm.setValues);
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

  function showModal() {
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
  }

  function handleEditClick() {
    if (!data) return;
    setValues({
      photos: data.pictures,
      ...(data.time && { time: data.time }),
      ...(data.content && { content: data.content }),
      ...(data.species && { species: data.species }),
      ...(data.breed && { breed: data.breed }),
      ...(data.lat && { lat: data.lat }),
      ...(data.lot && { lng: data.lot }),
    });
    router.push(`/posts/${id}/edit?type=${convertFromType(data.type)}`);
  }

  if (!isReady || !isLoggedIn) return null;
  return (
    <>
      <Dropdown
        menu={{
          items: [
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
