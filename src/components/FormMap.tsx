import CenterFixedMarker from "@/components/CenterFixedMarker";
import MyLocationButton from "@/components/MyLocationButton";
import useIsReady from "@/libs/hooks/useIsReady";
import useMap, { IdleCallbackArgs } from "@/libs/hooks/useMap";
import { Form } from "antd";
import { useEffect, useRef } from "react";
import { PostFormValues } from "./PostForm";
import { PostDetailResponse } from "@/libs/api/types";

interface FormMapProps {
  initialData?: PostDetailResponse | undefined;
}

export default function FormMap({ initialData }: FormMapProps) {
  const form = Form.useFormInstance<PostFormValues>();
  const isReady = useIsReady();
  const ref = useRef<HTMLDivElement>(null);
  const { map, registerIdleEvent } = useMap(ref);

  useEffect(() => {
    registerIdleEvent(async ({ centerLat, centerLng }: IdleCallbackArgs) => {
      form.setFields([
        { name: "coords", errors: [], value: [centerLat, centerLng] },
      ]);
    });
  }, [registerIdleEvent, form]);

  useEffect(() => {
    if (initialData && map.current) {
      const { lat, lot } = initialData;
      map.current.setCenter(new naver.maps.LatLng(lat, lot));
      form.setFieldValue("coords", [lat, lot]);
    }
  }, [initialData, map, form]);

  return (
    <div ref={ref} className="w-full aspect-square">
      <MyLocationButton mapRef={map} />
      {isReady ? <CenterFixedMarker /> : null}
    </div>
  );
}
