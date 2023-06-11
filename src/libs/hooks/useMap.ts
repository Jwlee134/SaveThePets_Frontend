import { RefObject, useCallback, useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import usePersistStore from "../store/usePersistStore";

export interface IdleCallbackArgs {
  centerLat: number;
  centerLng: number;
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
  zoom: number;
}

export default function useMap(ref: RefObject<HTMLDivElement>) {
  const idle = useRef<naver.maps.MapEventListener | null>(null);
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
    (cb: (arg: IdleCallbackArgs) => void, executeCallbackOnInit?: boolean) => {
      if (!map.current) return;
      if (executeCallbackOnInit) {
        const zoom = map.current.getZoom();
        const bounds = map.current.getBounds();
        const center = bounds.getCenter();
        const ne = bounds.getMax();
        const sw = bounds.getMin();
        cb({
          centerLat: center.y,
          centerLng: center.x,
          neLat: ne.y,
          neLng: ne.x,
          swLat: sw.y,
          swLng: sw.x,
          zoom,
        });
      }
      idle.current = naver.maps.Event.addListener(map.current, "idle", (e) => {
        const {
          __targets: {
            zoom: {
              target: {
                zoom,
                bounds: {
                  _ne: { _lat: neLat, _lng: neLng },
                  _sw: { _lat: swLat, _lng: swLng },
                },
                center: { _lat: centerLat, _lng: centerLng },
              },
            },
          },
        } = e;
        cb({ centerLat, centerLng, neLat, neLng, swLat, swLng, zoom });
      });
    },
    []
  );

  const unregisterIdleEvent = useCallback(() => {
    if (idle.current) {
      naver.maps.Event.removeListener(idle.current);
      idle.current = null;
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
