"use client";

import useIsReady from "@/libs/hooks/useIsReady";
import usePersistStore from "@/libs/store/usePersistStore";
import { IoListOutline, IoMapOutline } from "react-icons/io5";
import TimelineListView from "./TimelineListView";
import TimelineMapView from "./TimelineMapView";
import { shallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import TimelineDeleteModal from "./TimelineDeleteModal";
import { getPostDetail } from "@/libs/api";

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
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    select(data) {
      return data.timeline;
    },
  });

  if (!isReady) return null;
  return (
    <>
      <div className="flex items-center justify-between pt-8 pb-4">
        <div className="text-lg text-gray-500">타임라인</div>
        <div className="flex items-center space-x-4 text-lg">
          {data && <TimelineDeleteModal />}
          <button onClick={toggle}>
            {opt === "timeline" ? <IoMapOutline /> : <IoListOutline />}
          </button>
        </div>
      </div>
      {opt === "timeline" ? <TimelineListView /> : <TimelineMapView />}
    </>
  );
}
