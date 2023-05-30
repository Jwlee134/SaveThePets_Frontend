import { Dropdown, Modal } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

export default function PostDropdown() {
  const params = useParams();
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
      <Dropdown
        menu={{
          items: [
            {
              label: <Link href={`/posts/${params.id}/edit`}>수정</Link>,
              key: "0",
            },
            {
              label: <button onClick={showModal}>삭제</button>,
              key: "1",
            },
            {
              label: <Link href={`/posts/${params.id}/report`}>신고</Link>,
              key: "2",
            },
          ],
        }}
      >
        <IoMenuOutline />
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
