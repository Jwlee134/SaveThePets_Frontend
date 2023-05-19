import { RefObject, useEffect, useRef } from "react";

export default function useMap(ref: RefObject<HTMLDivElement>) {
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
    const mapRef = new naver.maps.Map(ref.current as HTMLElement, {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 15,
    });
    map.current = mapRef;
  }, [ref]);

  return { map, panToBounds };
}
