import { RefObject, useCallback, useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import usePersistStore from "../store/usePersistStore";

export default function useMap(ref: RefObject<HTMLDivElement>) {
  const idle = useRef<naver.maps.MapEventListener>();
  const { lat, lng, zoom } = usePersistStore(
    (state) => ({
      lat: state.coords.lat,
      lng: state.coords.lng,
      zoom: state.coords.zoom,
    }),
    shallow
  );
  const map = useRef<naver.maps.Map>();

  const panToBounds = useCallback((coords: naver.maps.Coord[]) => {
    //@ts-ignore
    const bounds = naver.maps.PointBounds.bounds(...coords);
    map.current?.panToBounds(bounds);
  }, []);

  const registerIdleEvent = useCallback(
    (cb: (lat: number, lng: number, zoom: number) => void) => {
      idle.current = naver.maps.Event.addListener(map.current, "idle", (e) => {
        if (!map.current) return;
        const {
          __targets: {
            zoom: {
              target: {
                zoom,
                center: { _lat, _lng },
              },
            },
          },
        } = e;
        cb(_lat, _lng, zoom);
      });
    },
    []
  );

  const unregisterIdleEvent = useCallback(() => {
    if (idle.current) {
      naver.maps.Event.removeListener(idle.current);
    }
  }, []);

  useEffect(() => {
    if (map.current) return;
    const mapRef = new naver.maps.Map(ref.current as HTMLElement, {
      center: new naver.maps.LatLng(lat, lng),
      zoom,
    });
    map.current = mapRef;
  }, [ref, lat, lng, zoom]);

  useEffect(() => {
    return () => {
      unregisterIdleEvent();
    };
  }, [unregisterIdleEvent]);

  return { map, panToBounds, registerIdleEvent, unregisterIdleEvent };
}
