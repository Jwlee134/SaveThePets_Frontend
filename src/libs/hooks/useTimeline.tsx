import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { hideMarker, hidePolyline } from "../utils";
import { useParams } from "next/navigation";

export default function useTimeline(
  map: MutableRefObject<naver.maps.Map | undefined>,
  panToBounds: (coords: naver.maps.Coord[]) => void
) {
  const param = useParams();
  const timelineMarkers = useRef<naver.maps.Marker[]>([]);
  const clickEvent = useRef<naver.maps.MapEventListener>();
  const [timelineNodesArr, setTimelineNodesArr] = useState<
    { id: string; node: HTMLElement }[]
  >([]);
  const polylines = useRef<naver.maps.Polyline[]>([]);
  const infoWindow = useRef<naver.maps.InfoWindow>();
  const [infoWindowObj, setInfoWindowObj] = useState<{
    node: HTMLElement;
    id: string;
  } | null>(null);

  const resetInfoWindow = useCallback(() => {
    if (infoWindow.current?.getMap()) infoWindow.current.setMap(null);
    infoWindow.current = undefined;
    setInfoWindowObj(null);
  }, []);

  const openInfoWindow = useCallback(
    (anchor: naver.maps.Marker | naver.maps.Coord, id: string) => {
      if (!infoWindow.current) {
        infoWindow.current = new naver.maps.InfoWindow({
          content: "<div id='infowindow' class='infowindow' />",
          borderWidth: 0,
          backgroundColor: "transparent",
          disableAnchor: true,
          pixelOffset: new naver.maps.Point(0, -12),
        });
      }
      infoWindow.current?.open(map.current!, anchor);
      const node = document.getElementById("infowindow");
      if (node) setInfoWindowObj({ node, id });
    },
    [map]
  );

  const resetPolylines = useCallback(() => {
    if (polylines.current.length) {
      polylines.current.forEach(hidePolyline);
      polylines.current = [];
    }
  }, []);

  const makePolylines = useCallback(
    (markers: naver.maps.Marker[]) => {
      if (polylines.current.length > 0) {
        polylines.current.forEach(hidePolyline);
        polylines.current = [];
      }
      markers.forEach((item, i, arr) => {
        if (i === arr.length - 1) return;
        const polyline = new naver.maps.Polyline({
          map: map.current,
          path: [
            new naver.maps.Point(item.getPosition().x, item.getPosition().y),
            new naver.maps.Point(
              arr[i + 1].getPosition().x,
              arr[i + 1].getPosition().y
            ),
          ],
          strokeColor: "#BEBEBE",
          strokeWeight: 5,
          strokeLineCap: "round",
        });
        polylines.current?.push(polyline);
      });
    },
    [map]
  );

  const resetTimelineAndPolylines = useCallback(() => {
    if (timelineMarkers.current.length) {
      timelineMarkers.current.forEach(hideMarker);
      timelineMarkers.current = [];
      setTimelineNodesArr([]);
    }
    resetPolylines();
  }, [resetPolylines]);

  const registerClickEvent = useCallback(
    ({
      shouldResetTimelineMarkers = true,
      customResetAction,
    }: {
      shouldResetTimelineMarkers?: boolean;
      customResetAction?: () => void;
    }) => {
      if (clickEvent.current)
        naver.maps.Event.removeListener(clickEvent.current);
      clickEvent.current = naver.maps.Event.addListener(
        map.current,
        "click",
        () => {
          resetInfoWindow();
          if (shouldResetTimelineMarkers) resetTimelineAndPolylines();
          if (customResetAction) customResetAction();
        }
      );
    },
    [map, resetInfoWindow, resetTimelineAndPolylines]
  );

  const setTimelineMarkers = useCallback(
    (
      data: {
        id: string;
        lat: number;
        lng: number;
      }[]
    ) => {
      // 데이터의 길이가 더 적다면(타임라인 마커를 삭제했을 때) 삭제된 타임라인 마커 제거
      if (data.length < timelineMarkers.current.length) {
        timelineMarkers.current = timelineMarkers.current.filter((mk) => {
          if (!data.some((item) => item.id === mk.getTitle())) {
            resetInfoWindow();
            mk.setMap(null);
            return false;
          }
          return true;
        });
        if (timelineMarkers.current.length === 1) resetPolylines();
      } else {
        data
          .filter(
            // 이미 존재하는 타임라인 마커의 중복 생성 방지 위해 filter
            (item) =>
              !timelineMarkers.current.some((mk) => item.id === mk.getTitle())
          )
          .forEach((coord, i) => {
            const size = param.id === coord.id ? 36 : 28;
            const anchor = param.id === coord.id ? 18 : 14;
            // 마커 생성
            const marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(coord.lat, coord.lng),
              map: map.current,
              icon: {
                content: `<div id="${coord.id}" />`,
                size: new naver.maps.Size(size, size),
                anchor: new naver.maps.Point(anchor, anchor),
              },
              title: coord.id,
            });
            // 각 마커 클릭시 인포윈도우 생성 이벤트 추가
            naver.maps.Event.addListener(marker, "click", () => {
              openInfoWindow(
                new naver.maps.Point(
                  marker.getPosition().x,
                  marker.getPosition().y
                ),
                coord.id
              );
            });
            timelineMarkers.current.push(marker);
            const node = document.getElementById(coord.id);
            if (node)
              setTimelineNodesArr((prev) => [...prev, { id: coord.id, node }]);
          });
      }
      // 마커 2개 이상이면 폴리라인으로 연결하고 줌
      if (timelineMarkers.current.length > 1) {
        makePolylines(timelineMarkers.current);
        panToBounds(timelineMarkers.current.map((mk) => mk.getPosition()));
      } else map.current?.panTo(timelineMarkers.current[0].getPosition());
      return registerClickEvent;
    },
    [
      makePolylines,
      map,
      openInfoWindow,
      panToBounds,
      registerClickEvent,
      resetInfoWindow,
      resetPolylines,
      param.id,
    ]
  );

  useEffect(() => {
    return () => {
      if (clickEvent.current) {
        naver.maps.Event.removeListener(clickEvent.current);
      }
    };
  }, []);

  return {
    infoWindowObj,
    timelineNodesArr,
    openInfoWindow,
    setTimelineMarkers,
  };
}
