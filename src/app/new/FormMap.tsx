import CenterFixedMarker from "@/components/CenterFixedMarker";
import MyLocationButton from "@/components/MyLocationButton";
import useMap from "@/libs/hooks/useMap";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

export default function FormMap({
  setLatLng,
}: {
  setLatLng: Dispatch<SetStateAction<number[]>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { map, registerIdleEvent } = useMap(ref);

  const cb = useCallback(
    (lat: number, lng: number) => {
      setLatLng([lat, lng]);
    },
    [setLatLng]
  );

  useEffect(() => {
    registerIdleEvent(cb);
  }, [registerIdleEvent, cb]);

  return (
    <div ref={ref} className="w-full aspect-square mb-6">
      <MyLocationButton mapRef={map} />
      <CenterFixedMarker />
    </div>
  );
}
