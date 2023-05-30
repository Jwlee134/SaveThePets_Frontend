import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Marker from "./Marker";
import { useQuery } from "@tanstack/react-query";
import useMap from "@/libs/hooks/useMap";
import { hideMarker, showMarker } from "@/libs/utils";
import useTimeline from "@/libs/hooks/useTimeline";
import usePersistStore from "@/libs/store/usePersistStore";
import MyLocationButton from "./MyLocationButton";
import { getPosts, getTimeline } from "@/libs/api/test";
import { createPortal } from "react-dom";
import TimelineMarker from "./TimelineMarker";
import InfoWindow from "./InfoWindow";

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { map, panToBounds, registerIdleEvent, unregisterIdleEvent } =
    useMap(ref);
  const {
    infoWindowObj,
    openInfoWindow,
    timelineNodesArr,
    setTimelineMarkers,
  } = useTimeline(map, panToBounds);
  const markers = useRef<naver.maps.Marker[]>([]);
  const clickedMarker = useRef<{ id: string; lat: number; lng: number }>();
  const [markerNodesArr, setMarkerNodesArr] = useState<
    { id: string; node: HTMLElement; thumbUrl: string }[]
  >([]);
  const [clickedId, setClickedId] = useState(0);
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const { data: timeline } = useQuery({
    queryKey: ["posts", clickedId, "timeline"],
    queryFn: getTimeline,
    enabled: !!clickedId,
  });
  const setCoords = usePersistStore((state) => state.setCoords);

  const idleEventCallback = useCallback(
    (lat: number, lng: number, zoom: number) => {
      console.log(lat, lng, zoom);
      if (!map.current) return;
      setCoords(lat, lng, zoom);
      const mapBounds = map.current.getBounds();
      markers.current.forEach((marker) => {
        const pos = marker.getPosition();
        if (mapBounds.hasPoint(pos)) showMarker(map, marker);
        else hideMarker(marker);
      });
    },
    [map, setCoords]
  );

  const customResetAction = useCallback(() => {
    markers.current.forEach((mk) => showMarker(map, mk));
    registerIdleEvent(idleEventCallback);
    setClickedId(0);
  }, [idleEventCallback, map, registerIdleEvent]);

  function setMarkers(
    data: {
      id: string;
      lat: number;
      lng: number;
    }[],
    map: naver.maps.Map,
    markers: MutableRefObject<naver.maps.Marker[]>
  ) {
    // 새로 받아온 데이터에 기존 마커와 동일한 데이터가 없다면 삭제
    markers.current = markers.current.filter((mk, i) => {
      const idx = data.findIndex((item) => item.id === mk.getTitle());
      if (idx == -1) {
        markers.current[i].setMap(null);
        setMarkerNodesArr((prev) => {
          const copied = [...prev];
          copied.splice(i, 1);
          return copied;
        });
        return false;
      }
      return true;
    });
    data
      .filter(
        // 이미 존재하는 마커의 중복 생성 방지 위해 filter
        (item) => !markers.current.some((mk) => item.id === mk.getTitle())
      )
      .forEach((coord) => {
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
        const node = document.getElementById(coord.id);
        if (node)
          setMarkerNodesArr((prev) => [
            ...prev,
            { id: coord.id, node, thumbUrl: "/sample.png" },
          ]);
        naver.maps.Event.addListener(marker, "click", () => {
          clickedMarker.current = coord;
          setClickedId(parseInt(marker.getTitle()));
        });
        markers.current.push(marker);
      });
  }

  // 마커 클릭 시 타임라인 보여주며 클릭된 마커의 인포윈도우 생성
  useEffect(() => {
    if (!timeline || !clickedMarker.current) return;
    unregisterIdleEvent();
    markers.current.forEach(hideMarker);
    openInfoWindow(
      new naver.maps.LatLng(
        clickedMarker.current.lat,
        clickedMarker.current.lng
      ),
      clickedMarker.current.id
    );
    setTimelineMarkers([clickedMarker.current, ...timeline])({
      customResetAction,
    });
  }, [
    timeline,
    customResetAction,
    openInfoWindow,
    setTimelineMarkers,
    unregisterIdleEvent,
  ]);

  useEffect(() => {
    if (map.current && posts && posts.length)
      setMarkers(posts, map.current, markers);
  }, [map, posts]);

  useEffect(() => {
    if (!map.current) return;
    registerIdleEvent(idleEventCallback);
  }, [map, registerIdleEvent, idleEventCallback]);

  useEffect(() => {
    if (markers.current.length)
      markers.current.forEach((mk) => mk.setMap(null));
  }, []);

  return (
    <div ref={ref} className="h-[var(--fit-screen)] relative">
      <MyLocationButton mapRef={map} />
      {markerNodesArr.length > 0 &&
        markerNodesArr.map(({ id, node, thumbUrl }) =>
          createPortal(<Marker url={thumbUrl} />, node, id)
        )}
      {timelineNodesArr.length > 0 &&
        timelineNodesArr.map(({ id, node }, i) =>
          createPortal(<TimelineMarker index={i} />, node, id)
        )}
      {infoWindowObj !== null &&
        createPortal(<InfoWindow id={infoWindowObj.id} />, infoWindowObj.node)}
    </div>
  );
}
