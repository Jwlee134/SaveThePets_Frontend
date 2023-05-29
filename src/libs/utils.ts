import { MutableRefObject } from "react";

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

export function formatCreatedAt(date: string) {
  const start = new Date(date).getTime();
  const end = Date.now();
  const diff = (end - start) / 1000;
  const times = [
    { name: "년", milliSeconds: 60 * 60 * 24 * 365 },
    { name: "달", milliSeconds: 60 * 60 * 24 * 30 },
    { name: "일", milliSeconds: 60 * 60 * 24 },
    { name: "시간", milliSeconds: 60 * 60 },
    { name: "분", milliSeconds: 60 },
  ];
  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);
    if (betweenTime > 0) {
      return `${betweenTime}${value.name} 전`;
    }
  }
  return "방금 전";
}

export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function cls(...args: string[]) {
  return args.join(" ");
}
