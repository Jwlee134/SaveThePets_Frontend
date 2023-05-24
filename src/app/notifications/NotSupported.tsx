import { IoNotificationsOff } from "react-icons/io5";

export default function NotSupported() {
  return (
    <div className="h-[var(--fit-screen)] flex flex-col items-center justify-center">
      <IoNotificationsOff className="text-9xl text-gray-200 mb-10" />
      <p className="text-sm text-gray-700">
        알림이 지원되지 않는 브라우저입니다.
      </p>
    </div>
  );
}
