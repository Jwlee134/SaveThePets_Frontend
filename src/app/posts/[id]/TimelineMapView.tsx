import useMap from "@/libs/hooks/useMap";
import useTimeline from "@/libs/hooks/useTimeline";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import InfoWindow from "@/components/InfoWindow";
import TimelineMarker from "@/components/TimelineMarker";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/libs/api";
import { TimelineResponse } from "@/libs/api/types";

export default function TimelineMapView() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
  });
  const ref = useRef<HTMLDivElement>(null);
  const { map, panToBounds } = useMap(ref, { lat: data?.lat, lng: data?.lot });
  const { infoWindowObj, timelineNodesArr, setTimelineMarkers } = useTimeline(
    map,
    panToBounds
  );

  useEffect(() => {
    if (!map.current || !data) return;
    const basePost: TimelineResponse = {
      address: data.address,
      breed: data.breed,
      picture: data.pictures[0],
      postLat: data.lat,
      postLot: data.lot,
      sightingPostId: parseInt(id),
      species: data.species,
      time: data.time,
    };
    setTimelineMarkers([basePost, ...data.timeline])({
      shouldResetTimelineMarkers: false,
    });
  }, [map, data, id, panToBounds, setTimelineMarkers]);

  return (
    <div ref={ref} className="relative aspect-square">
      {infoWindowObj !== null &&
        createPortal(
          <InfoWindow {...infoWindowObj.data} />,
          infoWindowObj.node
        )}
      {timelineNodesArr.length > 0 &&
        timelineNodesArr.map(({ id, node }, i) =>
          createPortal(<TimelineMarker index={i} />, node, id)
        )}
    </div>
  );
}
