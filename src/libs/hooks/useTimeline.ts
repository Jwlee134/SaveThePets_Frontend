import { MutableRefObject, ReactNode, useRef } from "react";
import { hideMarker, renderComponent } from "../utils";

export default function useTimeline(
  map: MutableRefObject<naver.maps.Map | undefined>,
  openInfoWindow: (
    anchor: naver.maps.Marker | naver.maps.Coord,
    component: ReactNode
  ) => void
) {
  const timelineMarkers = useRef<naver.maps.Marker[]>([]);

  function resetTimelineMarkers() {
    timelineMarkers.current.forEach(hideMarker);
    timelineMarkers.current = [];
  }

  function setTimelineMarkers(
    coord: {
      id: string;
      lat: number;
      lng: number;
    },
    infowindow: ReactNode,
    timelineMarker: ReactNode
  ) {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(coord.lat, coord.lng),
      map: map.current,
      icon: {
        content: `<div id="${coord.id}" />`,
        size: new naver.maps.Size(32, 32),
        anchor: new naver.maps.Point(16, 16),
      },
    });
    // 각 마커 클릭시 인포윈도우 생성 이벤트를 건다.
    naver.maps.Event.addListener(marker, "click", () => {
      openInfoWindow(
        new naver.maps.Point(marker.getPosition().x, marker.getPosition().y),
        infowindow
      );
    });
    timelineMarkers.current.push(marker);
    renderComponent(coord.id, timelineMarker);
  }

  return { timelineMarkers, setTimelineMarkers, resetTimelineMarkers };
}
