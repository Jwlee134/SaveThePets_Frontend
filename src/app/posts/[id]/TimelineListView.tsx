import TimelineMarker from "@/components/TimelineMarker";
import { Timeline, TimelineItemProps } from "antd";
import { IoAlertCircle } from "react-icons/io5";

export default function TimelineListView({
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
  const items: TimelineItemProps[] = [
    {
      dot: <IoAlertCircle className="text-3xl text-red-500 drop-shadow-md" />,
      children: (
        <div className="text-gray-500 ml-2">
          <div>2023-05-11, 14:00</div>
          <div>경북 경산시 대동 127-1</div>
        </div>
      ),
    },
    ...(timeline
      ? timeline.map((item, i) => ({
          dot: <TimelineMarker index={i + 1} sm />,
          children: (
            <div className="text-gray-500 ml-2">
              <div>2023-05-11, 14:00</div>
              <div>경북 경산시 대동 127-1</div>
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
