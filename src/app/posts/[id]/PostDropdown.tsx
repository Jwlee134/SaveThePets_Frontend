import useIsReady from "@/libs/hooks/useIsReady";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { Dropdown, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

export default function PostDropdown() {
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setValues = useBoundStore(({ postForm }) => postForm.setValues);
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const isReady = useIsReady();

  function showModal() {
    setIsModalOpen(true);
  }

  async function handleOk() {
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleEditClick() {
    setValues({
      photos: ["/sample1.jpg", "/sample2.jpg", "/sample3.jpg"],
      lat: 35.822507,
      lng: 128.758031,
      time: new Date().toISOString(),
      content: "asdf",
      species: 0,
      breed: 0,
    });
    router.push(`/posts/${params.id}/edit?type=missed`);
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
              onClick: () => router.push(`/posts/${params.id}/report`),
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
