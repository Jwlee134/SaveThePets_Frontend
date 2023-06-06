import Link from "next/link";
import { useParams } from "next/navigation";
import { IoBookmarkOutline, IoChatboxOutline } from "react-icons/io5";
import AddToTimelineButton from "./AddToTimelineButton";
import { useState } from "react";
import usePersistStore from "@/libs/store/usePersistStore";
import LoginModal from "@/components/LoginModal";
import useIsReady from "@/libs/hooks/useIsReady";

export default function PostInteractions() {
  const params = useParams();
  const isReady = useIsReady();
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    }
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <button onClick={handleClick}>
          <IoBookmarkOutline />
        </button>
        <Link href={`/posts/${params.id}/comments`}>
          <IoChatboxOutline />
        </Link>
        {isReady && isLoggedIn && <AddToTimelineButton />}
      </div>
      <LoginModal isModalOpen={isModalOpen} handleCancel={handleCancel} />
    </>
  );
}
