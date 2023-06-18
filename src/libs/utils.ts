import { MutableRefObject } from "react";
import dayjs from "dayjs";

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
  const start = new Date(dayjs(date).add(9, "hours").toISOString()).getTime();
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

export function createSearchParams(params: {
  [key: string]: string | string[];
}): URLSearchParams {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach((value) => {
        searchParams.append(key, value);
      });
    } else {
      searchParams.append(key, values);
    }
  });
  return searchParams;
}

export function convertToType(type: string) {
  const table: { [key: string]: number } = {
    missed: 0,
    witnessed: 1,
    saved: 2,
    distributed: 3,
  };
  return table[type] ?? -1;
}

export function convertFromType(type: number) {
  const table: { [key: number]: string } = {
    0: "실종",
    1: "목격",
    2: "보호",
    3: "분양",
  };
  return table[type];
}

export function createNotificationText(
  type: number,
  { nickname, breed }: { nickname?: string; breed?: string }
) {
  if (nickname && breed)
    return `${nickname}님이 ${breed} ${convertFromType(
      type
    )} 게시글에 댓글을 남겼습니다.`;
  if (breed) {
    if (type === 1)
      return `${breed}의 실종 위치 근처에 ${breed}로 추정되는 동물이 목격되었습니다. 클릭하여 확인해 보세요.`;
    return `${breed}의 실종 위치 근처에 ${breed}로 추정되는 동물이 보호중입니다. 클릭하여 확인해 보세요.`;
  }
}

export function formatTime(time: string) {
  return dayjs(time).format("YYYY-MM-DD, HH:mm");
}
