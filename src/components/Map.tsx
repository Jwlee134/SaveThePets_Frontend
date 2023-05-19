"use client";

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import InfoWindow from "./InfoWindow";
import Marker from "./Marker";
import TimelineMarker from "./TimelineMarker";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getTimeline } from "@/app/page";
import useMap from "@/libs/hooks/useMap";
import usePolyline from "@/libs/hooks/usePolyline";
import useInfoWindow from "@/libs/hooks/useInfoWindow";
import {
  hideMarker,
  hidePolyline,
  renderComponent,
  showMarker,
} from "@/libs/utils";
import useTimeline from "@/libs/hooks/useTimeline";
import MyLocationButton from "./MyLocationButton";

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { map, panToBounds } = useMap(ref);
  const { polylines, makePolylines } = usePolyline(map);
  const { openInfoWindow, resetInfoWindow } = useInfoWindow(map);
  const { timelineMarkers, setTimelineMarkers, resetTimelineMarkers } =
    useTimeline(map, openInfoWindow);

  const markers = useRef<naver.maps.Marker[]>([]);
  const clickedMarker = useRef<naver.maps.Marker>();
  const idle = useRef<naver.maps.MapEventListener>();
  const dragend = useRef<naver.maps.MapEventListener>();
  const click = useRef<naver.maps.MapEventListener>();
  const [clickedId, setClickedId] = useState(0);
  const { refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    onSuccess(data) {
      if (map.current) setMarkers(data, map.current, markers);
    },
  });
  useQuery({
    queryKey: ["posts", clickedId, "timeline"],
    queryFn: getTimeline,
    onSuccess(data) {
      renderTimeline(clickedMarker, data);
    },
    enabled: !!clickedId,
  });

  const registerIdleEvent = useCallback(() => {
    return naver.maps.Event.addListener(map.current, "idle", () => {
      if (!map.current) return;
      const mapBounds = map.current.getBounds();
      markers.current.forEach((marker) => {
        const pos = marker.getPosition();
        if (mapBounds.hasPoint(pos)) showMarker(map, marker);
        else hideMarker(marker);
      });
    });
  }, [map]);

  const registerDragendEvent = useCallback(() => {
    return naver.maps.Event.addListener(map.current, "dragend", (e) => {
      const { _lat, _lng } = e.coord;
      console.log(_lat, _lng);
      refetch();
    });
  }, [map, refetch]);

  function renderTimeline(
    origin: MutableRefObject<naver.maps.Marker | undefined>,
    data: {
      id: string;
      lat: number;
      lng: number;
    }[]
  ) {
    if (!origin.current) return;
    // dragend, idle 이벤트를 제거한다.
    if (dragend.current && idle.current)
      naver.maps.Event.removeListener([dragend.current, idle.current]);
    // 모든 마커들을 지도에서 지운다.
    markers.current.forEach(hideMarker);
    // 인포윈도우를 생성한다.
    openInfoWindow(
      new naver.maps.Point(
        origin.current.getPosition().x,
        origin.current.getPosition().y
      ),
      <InfoWindow />
    );
    // 타임라인의 좌표들로 새로운 마커 배열을 생성한다.
    data.forEach((coord, i) => {
      setTimelineMarkers(
        coord,
        <InfoWindow />,
        <TimelineMarker index={i + 1} />
      );
    });
    // 마커들을 폴리라인으로 잇는다.
    makePolylines([origin.current, ...timelineMarkers.current]);
    // 마커들이 지도에 전부 들어오게 지도를 이동시킨다.
    panToBounds([
      origin.current.getPosition(),
      ...timelineMarkers.current.map((mk) => mk.getPosition()),
    ]);
    // 지도 클릭 시 인포윈도우, 타임라인 마커 및 폴리라인 다 지우고 기존 마커들 보여주고 idle, dragend 이벤트 복원한다.
    click.current = naver.maps.Event.addListener(map.current, "click", () => {
      resetInfoWindow();
      resetTimelineMarkers();
      polylines.current?.forEach(hidePolyline);
      polylines.current = [];
      markers.current.forEach((mk) => showMarker(map, mk));
      idle.current = registerIdleEvent();
      dragend.current = registerDragendEvent();
      if (click.current) naver.maps.Event.removeListener(click.current);
      setClickedId(0);
    });
  }

  function setMarkers(
    data: {
      id: string;
      lat: number;
      lng: number;
    }[],
    map: naver.maps.Map,
    markers: MutableRefObject<naver.maps.Marker[]>
  ) {
    // 기존 마커 배열의 마커가 새로 들어오는 데이터 배열에 없다면 stale, 없앤다.
    // 있다면 기존 마커 배열에 또 추가할 필요가 없으므로 새로 들어오는 데이터 배열에서 뺀다.
    markers.current.filter((marker) => {
      const { x: lng, y: lat } = marker.getPosition();
      const idx = data.findIndex(
        (item) => item.lat === lat && item.lng === lng
      );
      if (idx !== -1) {
        data.splice(idx, 1);
        return true;
      }
      marker.setMap(null);
      return false;
    });
    // 데이터로 마커를 생성한다.
    data.forEach((coord) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coord.lat, coord.lng),
        map,
        icon: {
          content: `<div id="${coord.id}" />`,
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 72),
        },
        title: coord.id,
      });
      renderComponent(coord.id, <Marker />);
      naver.maps.Event.addListener(marker, "click", () => {
        clickedMarker.current = marker;
        setClickedId(parseInt(marker.getTitle()));
      });
      markers.current.push(marker);
    });
  }

  useEffect(() => {
    if (!map.current) return;
    idle.current = registerIdleEvent();
    dragend.current = registerDragendEvent();
  }, [map, registerIdleEvent, registerDragendEvent]);

  return (
    <div ref={ref} className="h-[var(--fit-screen)] relative">
      <MyLocationButton mapRef={map} />
    </div>
  );
}
