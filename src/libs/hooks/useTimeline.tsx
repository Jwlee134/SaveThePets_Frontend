import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { hideMarker, hidePolyline } from "../utils";
import { useParams } from "next/navigation";
import { InfoWindowProps } from "@/components/InfoWindow";
import { TimelineResponse } from "../api/types";

interface RegisterClickEventArgs {
  shouldResetTimelineMarkers?: boolean;
  customResetAction?: () => void;
}

export default function useTimeline(
  map: MutableRefObject<naver.maps.Map | undefined>,
  panToBounds: (coords: naver.maps.Coord[]) => void
) {
  const params = useParams();
  const timelineMarkers = useRef<naver.maps.Marker[]>([]);
  const clickEvent = useRef<naver.maps.MapEventListener | null>(null);
  const [timelineNodesArr, setTimelineNodesArr] = useState<
    { id: string; node: HTMLElement }[]
  >([]);
  const polylines = useRef<naver.maps.Polyline[]>([]);
  const infoWindow = useRef<naver.maps.InfoWindow>();
  const [infoWindowObj, setInfoWindowObj] = useState<{
    node: HTMLElement;
    data: InfoWindowProps;
  } | null>(null);

  const resetInfoWindow = useCallback(() => {
    if (infoWindow.current?.getMap()) infoWindow.current.setMap(null);
    infoWindow.current = undefined;
    setInfoWindowObj(null);
  }, []);

  const openInfoWindow = useCallback(
    (anchor: naver.maps.Marker | naver.maps.Coord, data: InfoWindowProps) => {
      if (!infoWindow.current) {
        infoWindow.current = new naver.maps.InfoWindow({
          content: "<div id='infowindow' class='infowindow' />",
          borderWidth: 0,
          backgroundColor: "transparent",
          disableAnchor: true,
          pixelOffset: new naver.maps.Point(0, -12),
        });
      }
      infoWindow.current?.open(map.current!, anchor); // 인포윈도우 노드 생성
      const node = document.getElementById("infowindow");
      if (node) setInfoWindowObj({ node, data }); // 실제 표시할 리액트 노드의 정보 저장
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

  // 타임라인이 표시된 상태에서 지도 클릭 시 타임라인이 보여지기 이전 상태로 돌아가기 위한 함수
  const registerClickEvent = useCallback(
    ({
      shouldResetTimelineMarkers = true, // 실종 게시글 세부정보 페이지에서는 지도 클릭하면 인포윈도우만 제거해야 하므로 추가된 항목
      customResetAction,
    }: RegisterClickEventArgs) => {
      // 중복 클릭 이벤트 생성 방지 위함
      if (clickEvent.current) {
        naver.maps.Event.removeListener(clickEvent.current);
        clickEvent.current = null;
      }
      clickEvent.current = naver.maps.Event.addListener(
        map.current,
        "click",
        () => {
          resetInfoWindow(); // 인포윈도우 제거
          if (shouldResetTimelineMarkers) resetTimelineAndPolylines(); // 타임라인 마커도 다 제거해야 한다면 제거
          if (customResetAction) customResetAction(); // 홈 지도에서는 idle event 재등록, 기존 마커들 다시 표시 등의 커스텀 액션 수행
        }
      );
    },
    [map, resetInfoWindow, resetTimelineAndPolylines]
  );

  const setTimelineMarkers = useCallback(
    (data: Omit<TimelineResponse, "address">[]) => {
      // 데이터의 길이가 더 적다면(타임라인 마커를 삭제했을 경우) 삭제된 타임라인 마커 제거 위한 필터
      if (data.length < timelineMarkers.current.length) {
        timelineMarkers.current = timelineMarkers.current.filter((mk) => {
          const idx = data.findIndex(
            (item) => item.sightingPostId.toString() === mk.getTitle()
          );
          if (idx === -1) {
            resetInfoWindow();
            mk.setMap(null);
            return false;
          }
          return true;
        });
        if (timelineMarkers.current.length === 1) resetPolylines();
      }
      setTimelineNodesArr((prev) => {
        return prev.filter((node) => {
          const idx = data.findIndex(
            (item) => item.sightingPostId.toString() === node.id
          );
          if (idx == -1) return false;
          return true;
        });
      });
      data
        .filter(
          // 이미 존재하는 타임라인 마커의 중복 생성 방지 위해 filter
          ({ sightingPostId }) =>
            !timelineMarkers.current.some(
              (mk) => sightingPostId.toString() === mk.getTitle()
            )
        )
        .forEach(
          (
            { sightingPostId, postLat, postLot, breed, species, time, picture },
            i
          ) => {
            const size =
              (params.id && params.id === sightingPostId.toString()) ||
              (!params.id && i === 0)
                ? 36
                : 28;
            const anchor =
              (params.id && params.id === sightingPostId.toString()) ||
              (!params.id && i === 0)
                ? 18
                : 14;
            // 전달받은 게시글 데이터로 마커 생성
            const marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(postLat, postLot),
              map: map.current,
              icon: {
                content: `<div id="${sightingPostId}" />`,
                size: new naver.maps.Size(size, size),
                anchor: new naver.maps.Point(anchor, anchor),
              },
              title: sightingPostId.toString(),
            });
            // 각 마커 클릭시 인포윈도우 생성 이벤트 추가
            naver.maps.Event.addListener(marker, "click", () => {
              openInfoWindow(
                new naver.maps.Point(
                  marker.getPosition().x,
                  marker.getPosition().y
                ),
                { breed, id: sightingPostId, picture, species, time }
              );
            });
            const node = document.getElementById(sightingPostId.toString());
            if (node) {
              timelineMarkers.current.push(marker);
              // 생성된 마커 노드를 실제 지도에 표시하기위한 리액트 노드의 배열에 저장
              setTimelineNodesArr((prev) => [
                ...prev,
                { id: sightingPostId.toString(), node },
              ]);
            }
          }
        );
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
      params.id,
    ]
  );

  useEffect(() => {
    return () => {
      if (clickEvent.current)
        naver.maps.Event.removeListener(clickEvent.current);
      resetInfoWindow();
      resetTimelineAndPolylines();
    };
  }, [resetInfoWindow, resetTimelineAndPolylines]);

  return {
    infoWindowObj,
    timelineNodesArr,
    openInfoWindow,
    setTimelineMarkers,
    resetInfoWindow,
    resetTimelineAndPolylines,
  };
}
