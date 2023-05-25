import usePersistStore from "@/libs/store/usePersistStore";
import { Avatar, Button, Divider, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import {
  IoNewspaperOutline,
  IoBookmarkOutline,
  IoChevronForwardOutline,
  IoChatboxOutline,
  IoLockClosedOutline,
  IoPersonRemoveOutline,
} from "react-icons/io5";

export default function Me() {
  const router = useRouter();
  const setAuth = usePersistStore((state) => state.setAuth);

  function handleLogout() {
    setAuth(null);
  }

  function handleRemoveClick() {
    Modal.confirm({
      title: "정말 탈퇴하시겠습니까?",
      content: "모든 활동 내역이 삭제되며 복구할 수 없습니다.",
      okText: "네",
      okType: "danger",
      cancelText: "아니오",
    });
  }

  return (
    <>
      <div className="flex p-6 items-center">
        <Avatar
          size={128}
          icon={<AiOutlineUser className="text-7xl" />}
          className="flex justify-center items-center shrink-0"
        />
        <div className="ml-6">
          <div className="text-2xl break-all">Username</div>
          <Button onClick={() => router.push("/me/edit")} className="mt-4">
            수정
          </Button>
        </div>
      </div>
      <Divider className="border-t-4 m-0" />
      <div className="p-6">
        <div className="text-lg text-gray-500 mb-4">활동 내역</div>
        <Link href="/me/myposts">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <IoNewspaperOutline className="text-lg mr-3" />
              작성한 글
            </div>
            <IoChevronForwardOutline className="text-lg text-gray-500" />
          </div>
        </Link>
        <Link href="/me/mycomments">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <IoChatboxOutline className="text-lg mr-3" />
              작성한 댓글
            </div>
            <IoChevronForwardOutline className="text-lg text-gray-500" />
          </div>
        </Link>
        <Link href="/me/mybookmarks">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IoBookmarkOutline className="text-lg mr-3" />
              북마크한 글
            </div>
            <IoChevronForwardOutline className="text-lg text-gray-500" />
          </div>
        </Link>
      </div>
      <Divider className="border-t-4 m-0" />
      <div className="p-6">
        <div className="text-lg text-gray-500 mb-4">계정</div>
        <button onClick={handleLogout} className="flex items-center mb-2">
          <IoLockClosedOutline className="text-lg mr-3" />
          로그아웃
        </button>
        <button onClick={handleRemoveClick} className="flex items-center">
          <IoPersonRemoveOutline className="text-lg mr-3" />
          탈퇴
        </button>
      </div>
    </>
  );
}
