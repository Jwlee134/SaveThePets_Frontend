import TimelineMarker from "@/components/TimelineMarker";
import { getPostDetail } from "@/libs/api";
import { formatTime } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import { Timeline, TimelineItemProps } from "antd";
import { useParams } from "next/navigation";
import { IoAlertCircle } from "react-icons/io5";

export default function TimelineListView() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
  });

  const items: TimelineItemProps[] = [
    ...(data
      ? [
          {
            dot: (
              <IoAlertCircle className="text-3xl text-red-500 drop-shadow-md" />
            ),
            children: (
              <div className="text-gray-500 ml-2">
                <div>{formatTime(data.time)}</div>
                <div>{data.address}</div>
              </div>
            ),
          },
        ]
      : []),
    ...(data && data.timeline.length
      ? data.timeline.map((item, i) => ({
          dot: <TimelineMarker index={i + 1} sm />,
          children: (
            <div className="text-gray-500 ml-2">
              <div>{formatTime(item.time)}</div>
              <div>{item.address}</div>
            </div>
          ),
        }))
      : []),
  ];

  return (
    <div className="p-2">
      <Timeline items={items} />
    </div>
  );
}
