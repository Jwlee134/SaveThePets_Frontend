import { Dropdown, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";

export default function Comment({
  handleEdit,
}: {
  handleEdit: (value: string) => void;
}) {
  const params = useParams();
  const value = `Lorem Ipsum is simply dummy text of the printing and typesetting
  industry. Lorem Ipsum has been the industry's standard dummy text ever
  since the 1500s, when an unknown printer took a galley of type and
  scrambled it to make a type specimen book.`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal() {
    setIsModalOpen(true);
  }

  async function handleOk() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex">
        <div className="relative overflow-hidden rounded-full w-14 h-14 mr-4 shrink-0">
          <Image
            src="/sample1.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              닉네임 <span className="text-xs text-gray-500">• 며칠 전</span>
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <button onClick={() => handleEdit(value)}>수정</button>
                    ),
                    key: "0",
                  },
                  {
                    label: <button onClick={showModal}>삭제</button>,
                    key: "1",
                  },
                  {
                    label: (
                      <Link href={`/posts/${params.id}/comments/1/report`}>
                        신고
                      </Link>
                    ),
                    key: "2",
                  },
                ],
              }}
            >
              <IoIosMore />
            </Dropdown>
          </div>
          <p className="text-sm font-light mt-2">{value}</p>
        </div>
      </div>
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
