import Spinner from "@/components/Spinner";
import { getMyLostPosts } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import { Modal, Radio, RadioChangeEvent, message } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

export default function AddToTimelineButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [clicked, setClicked] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "myLost"],
    queryFn: getMyLostPosts,
    enabled: clicked,
  });

  function onChange(e: RadioChangeEvent) {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  }

  function showModal() {
    setIsModalOpen(true);
  }

  async function handleFinish() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleAddClick() {
    setClicked(true);
  }

  useEffect(() => {
    if (!data) return;
    if (!data.length)
      message.warning({ content: "작성한 실종 게시글이 없습니다." });
    else showModal();
  }, [data]);

  return (
    <>
      <button disabled={isLoading} onClick={handleAddClick}>
        {isLoading ? <Spinner size="sm" /> : <IoAddCircleOutline />}
      </button>
      <Modal
        title="타임라인에 추가"
        open={isModalOpen}
        onOk={handleFinish}
        onCancel={handleCancel}
        okText="추가"
        cancelText="취소"
        centered
        bodyStyle={{ padding: "12px", maxHeight: 196, overflowY: "auto" }}
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <label htmlFor="1" className="flex flex-grow">
              <div className="relative rounded-full overflow-hidden w-16 h-16 mr-2">
                <Image
                  src="/sample1.jpg"
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <div>말티즈</div>
                <div className="text-xs">경북 경산시 대동 127-1</div>
                <div className="text-xs">2023-05-11, 14:00</div>
              </div>
            </label>
            <Radio id="1" checked={value === 1} value={1} onChange={onChange} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="2" className="flex flex-grow">
              <div className="relative rounded-full overflow-hidden w-16 h-16 mr-2">
                <Image
                  src="/sample2.jpg"
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <div>말티즈</div>
                <div className="text-xs">경북 경산시 대동 127-1</div>
                <div className="text-xs">2023-05-11, 14:00</div>
              </div>
            </label>
            <Radio id="2" checked={value === 2} value={2} onChange={onChange} />
          </div>
        </div>
      </Modal>
    </>
  );
}
