"use client";

import LoginRequired from "@/components/LoginRequired";
import Permission from "./Permission";
import NotificationList from "./NotificationList";
import { useCallback, useEffect, useRef, useState } from "react";
import usePersistStore from "@/libs/store/usePersistStore";
import { useMutation } from "@tanstack/react-query";
import { postPushSubscription } from "@/libs/api";

export default function Supported() {
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const ref = useRef<PermissionStatus>();
  const [status, setStatus] = useState<
    PermissionState | NotificationPermission
  >(Notification.permission);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: postPushSubscription,
    onSettled() {
      setIsLoading(false);
    },
  });

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

  const subscribe = useCallback(
    (registration: ServiceWorkerRegistration) => {
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
    },
    [mutate]
  );

  useEffect(() => {
    if (status === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) {
              const { endpoint = "", keys: { p256dh, auth } = {} } =
                subscription.toJSON();
              mutate({ endpoint, p256dh, auth });
            } else {
              subscribe(registration);
            }
          });
        } else {
          navigator.serviceWorker.register("/sw.js").then(subscribe);
        }
      });
    }
  }, [status, mutate, subscribe]);

  if (!isLoggedIn) return <LoginRequired />;
  if (status !== "granted" || isLoading)
    return <Permission setIsLoading={setIsLoading} />;
  return <NotificationList />;
}
