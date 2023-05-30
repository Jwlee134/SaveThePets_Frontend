"use client";

import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";
import { IoListOutline, IoMapOutline } from "react-icons/io5";
import TimelineListView from "./TimelineListView";
import TimelineMapView from "./TimelineMapView";
import { shallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTimeline } from "@/libs/api/test";
import TimelineDeleteModal from "./TimelineDeleteModal";
import { useEffect, useState } from "react";

export const post = { id: "10", lat: 37.2695704, lng: 127.105399 };

export default function Timeline() {
  const isReady = useIsReady();
  const { opt, toggle } = usePersistStore(
    (state) => ({
      opt: state.viewOpts.postTimelineViewOpt,
      toggle: state.setPostTimelineViewOpt,
    }),
    shallow
  );
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id, "timeline"],
    queryFn: getTimeline,
  });
  const [timeline, setTimeline] = useState<
    | {
        id: string;
        lat: number;
        lng: number;
      }[]
    | undefined
  >();

  useEffect(() => {
    if (data) setTimeline(data);
  }, [data]);

  if (!isReady) return null;
  return (
    <>
      <div className="flex items-center justify-between pt-8 pb-4">
        <div className="text-lg text-gray-500">타임라인</div>
        <div className="flex items-center space-x-4 text-lg">
          {timeline && (
            <TimelineDeleteModal
              timeline={timeline}
              setTimeline={setTimeline}
            />
          )}
          <button onClick={toggle}>
            {opt === "timeline" ? <IoMapOutline /> : <IoListOutline />}
          </button>
        </div>
      </div>
      {opt === "timeline" ? (
        <TimelineListView timeline={timeline} />
      ) : (
        <TimelineMapView timeline={timeline} />
      )}
    </>
  );
}
