import Link from "next/link";
import { useParams } from "next/navigation";
import { IoBookmarkOutline, IoChatboxOutline } from "react-icons/io5";
import AddToTimelineButton from "./AddToTimelineButton";
import { useState } from "react";
import usePersistStore from "@/libs/store/usePersistStore";
import LoginModal from "@/components/LoginModal";
import useIsReady from "@/libs/hooks/useIsReady";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBookmark, deleteBookmark, getPostDetail } from "@/libs/api";
import { PostDetailResponse } from "@/libs/api/types";

export default function PostInteractions() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isReady = useIsReady();
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onMutate(v: boolean) {
    const prevData: PostDetailResponse | undefined = queryClient.getQueryData([
      "posts",
      id,
    ]);
    if (!prevData) return;
    await queryClient.cancelQueries({ queryKey: ["posts", id] });
    queryClient.setQueryData(["posts", id], {
      ...prevData,
      bookmarked: v,
    });
    return { prevData };
  }

  function onError(context: { prevData: PostDetailResponse } | undefined) {
    queryClient.setQueryData(["posts", id], context?.prevData);
  }

  function onSettled() {
    queryClient.invalidateQueries(["posts", id]);
  }

  const { data } = useQuery({
    queryFn: getPostDetail,
    queryKey: ["posts", id],
  });
  const { mutate: createBm } = useMutation({
    mutationFn: () => createBookmark(id),
    useErrorBoundary: true,
    onMutate() {
      return onMutate(true);
    },
    onError(error, variables, context) {
      onError(context);
    },
    onSettled,
  });
  const { mutate: deleteBm } = useMutation({
    mutationFn: () => deleteBookmark(id),
    useErrorBoundary: true,
    onMutate() {
      return onMutate(false);
    },
    onError(error, variables, context) {
      onError(context);
    },
    onSettled,
  });

  function showModal() {
    setIsModalOpen(true);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleClick() {
    if (!isLoggedIn) {
      showModal();
    } else {
      if (!data) return;
      if (data.bookmarked) deleteBm();
      else createBm();
    }
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <button onClick={handleClick}>
          <IoBookmarkOutline />
        </button>
        <Link href={`/posts/${id}/comments`}>
          <IoChatboxOutline />
        </Link>
        {isReady && isLoggedIn && <AddToTimelineButton />}
      </div>
      <LoginModal isModalOpen={isModalOpen} handleCancel={handleCancel} />
    </>
  );
}
