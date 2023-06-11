import { useQuery } from "@tanstack/react-query";
import NotificationItem from "./NotificationItem";
import useBoundStore from "@/libs/store";
import { useEffect } from "react";
import { getNotifications } from "@/libs/api";

export default function NotificationList() {
  const setIsEmpty = useBoundStore(
    ({ notification }) => notification.setIsEmpty
  );
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    suspense: true,
    useErrorBoundary: true,
  });

  useEffect(() => {
    if (data && data.length) setIsEmpty(false);
  }, [data, setIsEmpty]);

  return (
    <ul className="space-y-4 p-4 overflow-x-hidden">
      {data?.map((item) => (
        <NotificationItem key={item.alarmId} {...item} />
      ))}
    </ul>
  );
}
