import { createTimeline, getMyLostPosts } from "@/libs/api";
import { breeds } from "@/libs/constants";
import { formatTime } from "@/libs/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Radio, message } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

export default function AddToTimelineButton() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { data } = useQuery({
    queryKey: ["posts", "myLost"],
    queryFn: getMyLostPosts,
    suspense: true,
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: createTimeline,
    onSuccess(data, { missingPostId }) {
      if (data) {
        message.success({ content: "추가되었습니다." });
        queryClient.invalidateQueries({ queryKey: ["posts", missingPostId] });
        setIsModalOpen(false);
      } else {
        message.error({ content: "이미 추가된 게시글입니다." });
      }
    },
  });

  function showModal() {
    setIsModalOpen(true);
  }

  function handleFinish() {
    mutate({ missingPostId: value, sightPostId: parseInt(id) });
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleAddClick() {
    if (!data || !data?.length)
      message.warning({ content: "작성한 실종 게시글이 없습니다." });
    else showModal();
  }

  return (
    <>
      <button onClick={handleAddClick}>
        <IoAddCircleOutline />
      </button>
      <Modal
        title="타임라인에 추가"
        open={isModalOpen}
        onOk={handleFinish}
        onCancel={handleCancel}
        okText="추가"
        cancelText="취소"
        centered
        bodyStyle={{ maxHeight: 196, overflowY: "auto" }}
        confirmLoading={isLoading}
        afterClose={() => setValue(0)}
        okButtonProps={{ disabled: !value }}
      >
        <div className="space-y-3 overflow-hidden">
          {data?.map((post) => (
            <button
              key={post.postId}
              onClick={() => setValue(post.postId)}
              className="flex justify-between w-full"
            >
              <div className="relative rounded-full overflow-hidden w-16 h-16 mr-2">
                <Image
                  src={post.picture}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col items-start">
                <div>{breeds[post.species][post.breed]}</div>
                <div className="text-xs">{post.address}</div>
                <div className="text-xs">{formatTime(post.time)}</div>
              </div>
              <Radio
                id={post.postId.toString()}
                checked={value === post.postId}
                value={post.postId}
                className="m-auto"
              />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
