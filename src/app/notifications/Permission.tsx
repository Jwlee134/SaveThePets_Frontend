import { Button, Modal, message } from "antd";
import { IoNotifications } from "react-icons/io5";

export default function Permission() {
  function handlePermission() {
    if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "denied")
          message.error("알림 권한이 거부되었습니다.");
      });
    } else {
      Modal.error({
        title: "이전에 알림 권한을 거부하셨습니다.",
        content: "브라우저의 사이트 설정에서 직접 권한을 변경해야 합니다.",
        okButtonProps: { type: "default" },
        okText: "확인",
      });
    }
  }

  return (
    <div className="h-[var(--fit-screen)] flex flex-col items-center justify-center">
      <IoNotifications className="text-9xl text-gray-200 mb-10" />
      <p className="text-sm mb-5 text-center text-gray-700">
        잃어버린 나의 반려동물이 주변에서 목격됐는지,
        <br />
        게시글 댓글 알림 등 유용한 알림을 수신하려면
        <br />
        알림 권한을 허용해 주세요.
      </p>
      <Button onClick={handlePermission}>허용</Button>
    </div>
  );
}
