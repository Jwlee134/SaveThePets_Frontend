"use client";

import LoginRequired from "@/components/LoginRequired";
import Permission from "./Permission";
import NotificationList from "./NotificationList";
import { useEffect, useRef, useState } from "react";
import usePersistStore from "@/libs/store/usePersistStore";

export default function Supported() {
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const ref = useRef<PermissionStatus>();
  const [status, setStatus] = useState<
    PermissionState | NotificationPermission
  >(Notification.permission);

  function listener(e: Event) {
    setStatus((e.target as PermissionStatus).state);
  }

  useEffect(() => {
    navigator.permissions.query({ name: "notifications" }).then((status) => {
      ref.current = status;
      setStatus(status.state);
      status.addEventListener("change", listener);
    });
    return () => {
      if (ref.current) ref.current.removeEventListener("change", listener);
    };
  }, []);

  if (!isLoggedIn) return <LoginRequired />;
  if (status !== "granted") return <Permission />;
  return <NotificationList />;
}
