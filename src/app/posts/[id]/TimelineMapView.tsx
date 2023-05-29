import useMap from "@/libs/hooks/useMap";
import useTimeline from "@/libs/hooks/useTimeline";
import { useEffect, useRef } from "react";
import { post } from "./Timeline";
import { createPortal } from "react-dom";
import InfoWindow from "@/components/InfoWindow";
import TimelineMarker from "@/components/TimelineMarker";

export default function TimelineMapView({
  timeline,
}: {
  timeline:
    | {
        id: string;
        lat: number;
        lng: number;
      }[]
    | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { map, panToBounds } = useMap(ref);
  const { infoWindowObj, timelineNodesArr, setTimelineMarkers } = useTimeline(
    map,
    panToBounds
  );

  useEffect(() => {
    if (!map.current || !timeline) return;
    console.log("timelinemapview");
    setTimelineMarkers([post, ...timeline])({
      shouldResetTimelineMarkers: false,
    });
  }, [panToBounds, map, setTimelineMarkers, timeline]);

  return (
    <div ref={ref} className="relative aspect-square">
      {infoWindowObj !== null &&
        createPortal(<InfoWindow id={infoWindowObj.id} />, infoWindowObj.node)}
      {timelineNodesArr.length > 0 &&
        timelineNodesArr.map(({ id, node }, i) =>
          createPortal(<TimelineMarker index={i} />, node, id)
        )}
    </div>
  );
}
