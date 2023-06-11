import TimelineMarker from "@/components/TimelineMarker";
import { deleteTimeline, getPostDetail } from "@/libs/api";
import { PostDetailResponse } from "@/libs/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Timeline, TimelineItemProps, message } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoTrash, IoTrashOutline } from "react-icons/io5";

export default function TimelineDeleteModal() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    select(data) {
      return data.timeline;
    },
  });
  const { mutate } = useMutation({
    mutationFn: deleteTimeline,
    useErrorBoundary: true,
    async onMutate({ sightPostId }) {
      await queryClient.cancelQueries({ queryKey: ["posts", id] });
      const prevData: PostDetailResponse | undefined = queryClient.getQueryData(
        ["posts", id]
      );
      queryClient.setQueryData(["posts", id], {
        ...prevData,
        timeline: prevData?.timeline.filter(
          (item) => item.sightingPostId !== sightPostId
        ),
      });
      return { prevData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["posts", id], context?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal() {
    if (data && !data.length) message.warning("삭제할 타임라인이 없습니다.");
    else setIsModalOpen(true);
  }

  function handleOk() {
    setIsModalOpen(false);
  }

  const items: TimelineItemProps[] =
    data?.map((item, i) => ({
      dot: <TimelineMarker index={i + 1} sm />,
      children: (
        <div className="flex justify-between">
          <div className="text-gray-500 ml-2">
            <div>2023-05-11, 14:00</div>
            <div>경북 경산시 대동 127-1</div>
          </div>
          <button
            className="text-red-500 text-lg"
            onClick={() => {
              mutate({
                missingPostId: parseInt(id),
                sightPostId: item.sightingPostId,
              });
            }}
          >
            <IoTrash />
          </button>
        </div>
      ),
    })) || [];

  useEffect(() => {
    if (data && data.length === 0) setIsModalOpen(false);
  }, [data]);

  return (
    <>
      <button onClick={showModal}>
        <IoTrashOutline />
      </button>
      <Modal
        title="타임라인 삭제"
        open={isModalOpen}
        onOk={handleOk}
        centered
        okType="danger"
        okText="닫기"
        bodyStyle={{ maxHeight: 230, overflowY: "auto", padding: "0 12px" }}
      >
        <Timeline items={items} className="pt-5" />
      </Modal>
    </>
  );
}
