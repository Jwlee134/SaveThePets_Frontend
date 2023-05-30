import useMap from "@/libs/hooks/useMap";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoLocation } from "react-icons/io5";

export default function StaticMap() {
  const params = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const { map } = useMap(ref);
  const [marker, setMarker] = useState<HTMLElement | null>(null);
  const markerRef = useRef<naver.maps.Marker>();

  useEffect(() => {
    const lat = 37.3695704;
    const lng = 127.105399;
    markerRef.current = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: map.current,
      icon: {
        content: `<div id="${params.id}" />`,
        size: new naver.maps.Size(36, 36),
        anchor: new naver.maps.Point(18, 36),
      },
    });
    const node = document.getElementById(params.id);
    if (node) setMarker(node);
    map.current?.setCenter(new naver.maps.LatLng(lat, lng));

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [map, params.id]);

  return (
    <div ref={ref} className="aspect-square">
      {marker !== null &&
        createPortal(<IoLocation className="text-4xl" />, marker)}
    </div>
  );
}
