import { MutableRefObject, useRef } from "react";

export default function usePolyline(
  map: MutableRefObject<naver.maps.Map | undefined>
) {
  const polylines = useRef<naver.maps.Polyline[]>([]);

  function makePolylines(markers: naver.maps.Marker[]) {
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
  }

  return { polylines, makePolylines };
}
