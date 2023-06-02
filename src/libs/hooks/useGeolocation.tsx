import { Modal, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useGeolocation({
  callback,
}: {
  callback: (lat: number, lng: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const watchId = useRef(-1);

  const clearWatch = useCallback(() => {
    if (watchId.current !== -1)
      navigator.geolocation.clearWatch(watchId.current);
  }, []);

  function handlePermission(callback: () => void) {
    navigator.permissions.query({ name: "geolocation" }).then((res) => {
      switch (res.state) {
        case "granted":
          callback();
          break;
        case "denied":
          Modal.error({
            title: "위치 권한이 거부되었습니다.",
            content: <p>설정에서 이 사이트의 위치 권한을 직접 허용하세요.</p>,
            okText: "확인",
          });
          break;
        default:
          Modal.info({
            title: "위치 권한을 허용해 주세요.",
            content: (
              <p>현재 위치를 가져오기 위해 위치 권한의 허용이 필요합니다.</p>
            ),
            onOk: callback,
            okText: "확인",
          });
      }
    });
  }

  function handleGetCurrentPos() {
    if (isLoading) return;
    handlePermission(() => {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          callback(latitude, longitude);
          setIsLoading(false);
        },
        () => {
          message.error("위치 정보를 가져오는 데 실패했습니다.");
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  function handleWatchPos() {
    if (isLoading) return;
    handlePermission(() => {
      setIsLoading(true);
      clearWatch();
      watchId.current = navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          callback(latitude, longitude);
          setIsLoading(false);
        },
        () => {
          message.error("위치 정보를 가져오는 데 실패했습니다.");
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  useEffect(() => {
    return () => {
      clearWatch();
    };
  }, [clearWatch]);

  return { isLoading, handleGetCurrentPos, handleWatchPos };
}
