import useGeolocation from "@/libs/hooks/useGeolocation";
import { MutableRefObject, useRef } from "react";
import { MdMyLocation } from "react-icons/md";
import Spinner from "./Spinner";

export default function MyLocationButton({
  mapRef,
}: {
  mapRef: MutableRefObject<naver.maps.Map | undefined>;
}) {
  const shouldPanTo = useRef(true);
  const marker = useRef<naver.maps.Marker>();
  const { isLoading, handleWatchPos } = useGeolocation({
    callback(lat, lng) {
      if (shouldPanTo.current) {
        mapRef.current?.panTo(new naver.maps.LatLng(lat, lng));
        shouldPanTo.current = false;
      }
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
    },
  });

  function handleClick() {
    if (!shouldPanTo.current) shouldPanTo.current = true;
    handleWatchPos();
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-12 h-12 rounded-full bg-white shadow-md absolute right-6 bottom-6 z-50 text-2xl grid place-items-center"
    >
      {isLoading ? <Spinner /> : <MdMyLocation />}
    </button>
  );
}
