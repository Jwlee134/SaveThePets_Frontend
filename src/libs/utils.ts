import { MutableRefObject, ReactNode } from "react";
import { createRoot } from "react-dom/client";

export function showMarker(
  map: MutableRefObject<naver.maps.Map | undefined>,
  marker: naver.maps.Marker
) {
  if (marker.getMap()) return;
  if (map.current) marker.setMap(map.current);
}

export function hideMarker(marker: naver.maps.Marker) {
  if (!marker.getMap()) return;
  marker.setMap(null);
}

export function hidePolyline(polyline: naver.maps.Polyline) {
  polyline.setMap(null);
}

export function renderComponent(id: string, children: ReactNode) {
  const el = document.getElementById(id)!;
  const root = createRoot(el);
  root.render(children);
}
