import { Modal, Spin, message } from "antd";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MdMyLocation } from "react-icons/md";

export default function MyLocationButton({
  mapRef,
}: {
  mapRef: MutableRefObject<naver.maps.Map | undefined>;
}) {
  const id = useRef(-1);
  const shouldPanTo = useRef(false);
  const marker = useRef<naver.maps.Marker>();
  const [loading, setLoading] = useState(false);

  function clearWatch() {
    if (id.current !== -1) navigator.geolocation.clearWatch(id.current);
  }

  function panTo(lat: number, lng: number) {
    mapRef.current?.panTo(new naver.maps.LatLng(lat, lng));
    shouldPanTo.current = false;
  }

  function setMarker(lat: number, lng: number) {
    if (!marker.current) {
      marker.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        icon: {
          content: `<div class="my-location_outer"><div class="my-location_inner" /></div>`,
          size: new naver.maps.Size(20, 20),
          anchor: new naver.maps.Point(10, 10),
        },
      });
    } else {
      marker.current.setPosition(new naver.maps.LatLng(lat, lng));
    }
  }

  function handleGeolocation() {
    setLoading(true);
    shouldPanTo.current = true;
    clearWatch();
    id.current = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        if (shouldPanTo.current) panTo(latitude, longitude);
        setMarker(latitude, longitude);
        setLoading(false);
      },
      () => {
        message.error("위치 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function onClick() {
    navigator.permissions.query({ name: "geolocation" }).then((res) => {
      switch (res.state) {
        case "granted":
          handleGeolocation();
          break;
        case "denied":
          Modal.error({
            title: "위치 권한이 거부되었습니다.",
            content: <p>설정에서 이 사이트의 위치 권한을 직접 허용하세요.</p>,
            okButtonProps: { type: "default" },
            okText: "확인",
          });
          break;
        default:
          Modal.info({
            title: "위치 권한을 허용해 주세요.",
            content: (
              <p>현재 위치를 가져오기 위해 위치 권한의 허용이 필요합니다.</p>
            ),
            okButtonProps: { type: "default" },
            onOk: handleGeolocation,
            okText: "확인",
          });
      }
    });
  }

  useEffect(() => {
    return () => {
      clearWatch();
    };
  }, []);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-12 h-12 rounded-full bg-white shadow-md absolute right-6 bottom-6 z-50 text-2xl grid place-items-center"
    >
      {loading ? <Spin /> : <MdMyLocation />}
    </button>
  );
}
