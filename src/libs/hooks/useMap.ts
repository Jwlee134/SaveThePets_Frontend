import { RefObject, useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import usePersistStore from "../store/usePersistStore";

export default function useMap(ref: RefObject<HTMLDivElement>) {
  const { lat, lng, zoom } = usePersistStore(
    (state) => ({
      lat: state.lat,
      lng: state.lng,
      zoom: state.zoom,
    }),
    shallow
  );
  const map = useRef<naver.maps.Map>();

  function panToBounds(coords: naver.maps.Coord[]) {
    //@ts-ignore
    const bounds = naver.maps.PointBounds.bounds(...coords);
    map.current?.panToBounds(bounds, undefined, {
      top: 80,
      right: 80,
      bottom: 80,
      left: 80,
    });
  }

  useEffect(() => {
    if (map.current) return;
    const mapRef = new naver.maps.Map(ref.current as HTMLElement, {
      center: new naver.maps.LatLng(lat, lng),
      zoom,
    });
    map.current = mapRef;
  }, [ref, lat, lng, zoom]);

  return { map, panToBounds };
}
