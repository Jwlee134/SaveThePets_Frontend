import TimelineMarker from "@/components/TimelineMarker";
import { Modal, Timeline, TimelineItemProps, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoTrash, IoTrashOutline } from "react-icons/io5";

export default function TimelineDeleteModal({
  timeline,
  setTimeline,
}: {
  timeline:
    | {
        id: string;
        lat: number;
        lng: number;
      }[]
    | undefined;
  setTimeline: Dispatch<
    SetStateAction<
      | {
          id: string;
          lat: number;
          lng: number;
        }[]
      | undefined
    >
  >;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal() {
    if (timeline && !timeline.length)
      message.warning("삭제할 타임라인이 없습니다.");
    else setIsModalOpen(true);
  }

  function handleOk() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  const items: TimelineItemProps[] = Array(3)
    .fill(0)
    .map((item, i) => ({
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
              setTimeline(timeline?.filter((t) => t.id !== item.id));
            }}
          >
            <IoTrash />
          </button>
        </div>
      ),
    }));

  useEffect(() => {
    if (timeline && timeline.length === 0) setIsModalOpen(false);
  }, [timeline]);

  return (
    <>
      {/* TODO: 타임라인 없으면 아예 버튼 없애기 */}
      <button onClick={showModal}>
        <IoTrashOutline />
      </button>
      <Modal
        title="타임라인 삭제"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        okType="danger"
        okText="전체 삭제"
        cancelText="닫기"
        bodyStyle={{ maxHeight: 230, overflowY: "auto", padding: "0 12px" }}
      >
        <Timeline items={items} className="pt-5" />
      </Modal>
    </>
  );
}
