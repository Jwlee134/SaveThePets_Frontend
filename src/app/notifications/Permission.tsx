import { postPushSubscription } from "@/libs/api";
import { useMutation } from "@tanstack/react-query";
import { Button, Modal, message } from "antd";
import { Dispatch, SetStateAction } from "react";
import { IoNotifications } from "react-icons/io5";

export default function Permission({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutate } = useMutation({
    mutationFn: postPushSubscription,
    onSettled() {
      setIsLoading(false);
    },
  });

  function handlePermission() {
    setIsLoading(true);
    if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "denied")
          message.error("알림 권한이 거부되었습니다.");
        if (permission === "granted") {
          navigator.serviceWorker.register("/sw.js").then((registration) => {
            registration.pushManager.getSubscription().then((subscription) => {
              if (subscription) {
                const { endpoint = "", keys: { p256dh, auth } = {} } =
                  subscription.toJSON();
                mutate({ endpoint, p256dh, auth });
              } else {
                registration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                      "BLkjZY4KvUxeO7rBDQd8SIkwOlKqmTO7osgLH9mWQE1ALmr6McAEPDC4uQfXLo1wmdgXj1BW7EybpLvsuecRXYk",
                  })
                  .then((subscription) => {
                    const { endpoint = "", keys: { p256dh, auth } = {} } =
                      subscription.toJSON();
                    mutate({ endpoint, p256dh, auth });
                  });
              }
            });
          });
        }
      });
    } else {
      Modal.error({
        title: "이전에 알림 권한을 거부하셨습니다.",
        content: "브라우저의 사이트 설정에서 직접 권한을 변경해야 합니다.",
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
