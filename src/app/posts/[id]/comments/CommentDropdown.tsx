import { deleteComment } from "@/libs/api";
import { PostDetailResponse } from "@/libs/api/types";
import useIsReady from "@/libs/hooks/useIsReady";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";

interface CommentDropdownProps {
  id: number;
  content: string;
}

export default function CommentDropdown({ id, content }: CommentDropdownProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const enableEditMode = useBoundStore(({ comment }) => comment.enableEditMode);
  const isReady = useIsReady();
  const { mutate } = useMutation({
    mutationFn: () => deleteComment(id),
    useErrorBoundary: true,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", params.id] });
      const prevData: PostDetailResponse = queryClient.getQueryData([
        "posts",
        params.id,
      ])!;
      queryClient.setQueryData(["posts", params.id], {
        ...prevData,
        comments: prevData.comments.filter(
          (comment) => comment.commentId !== id
        ),
      });
      return { prevData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["posts", params.id], context?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["posts", params.id] });
    },
  });

  function showModal() {
    setIsModalOpen(true);
  }

  function handleClose() {
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
              onClick: () => enableEditMode({ id, value: content }),
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
                router.push(`/posts/${params.id}/comments/${id}/report`),
            },
          ],
        }}
      >
        <IoIosMore />
      </Dropdown>
      <Modal
        title="정말 삭제하시겠습니까?"
        open={isModalOpen}
        onOk={() => mutate()}
        onCancel={handleClose}
        okText="삭제"
        okType="danger"
        cancelText="취소"
      />
    </>
  );
}
