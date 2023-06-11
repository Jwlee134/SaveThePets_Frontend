import CenterFixedMarker from "@/components/CenterFixedMarker";
import MyLocationButton from "@/components/MyLocationButton";
import useIsReady from "@/libs/hooks/useIsReady";
import useMap, { IdleCallbackArgs } from "@/libs/hooks/useMap";
import useBoundStore from "@/libs/store";
import { Form } from "antd";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import { PostFormValues } from "./PostForm";

export default function FormMap() {
  const form = Form.useFormInstance<PostFormValues>();
  const isReady = useIsReady();
  const ref = useRef<HTMLDivElement>(null);
  const { map, registerIdleEvent } = useMap(ref);
  const { lat, lng } = useBoundStore(
    ({ postForm }) => ({ lat: postForm.lat, lng: postForm.lng }),
    shallow
  );

  useEffect(() => {
    registerIdleEvent(async ({ centerLat, centerLng }: IdleCallbackArgs) => {
      form.setFields([
        { name: "coords", errors: [], value: [centerLat, centerLng] },
      ]);
    });
  }, [registerIdleEvent, form]);

  useEffect(() => {
    if (lat && lng && map.current) {
      map.current.setCenter(new naver.maps.LatLng(lat, lng));
      form.setFieldValue("coords", [lat, lng]);
    }
  }, [lat, lng, map, form]);

  return (
    <div ref={ref} className="w-full aspect-square">
      <MyLocationButton mapRef={map} />
      {isReady ? <CenterFixedMarker /> : null}
    </div>
  );
}
