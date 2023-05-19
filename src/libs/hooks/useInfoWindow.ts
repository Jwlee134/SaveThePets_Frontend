import { MutableRefObject, ReactNode, useRef } from "react";
import { Root, createRoot } from "react-dom/client";

export default function useInfoWindow(
  map: MutableRefObject<naver.maps.Map | undefined>
) {
  const infoWindow = useRef<naver.maps.InfoWindow>();
  const root = useRef<Root>();

  function resetInfoWindow() {
    if (infoWindow.current?.getMap()) infoWindow.current.setMap(null);
    infoWindow.current = undefined;
    root.current?.unmount();
    root.current = undefined;
  }

  function openInfoWindow(
    anchor: naver.maps.Marker | naver.maps.Coord,
    component: ReactNode
  ) {
    if (!infoWindow.current) {
      infoWindow.current = new naver.maps.InfoWindow({
        content: "<div id='infowindow' class='infowindow' />",
        borderWidth: 0,
        backgroundColor: "transparent",
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(0, -12),
      });
    }
    if (infoWindow.current?.getMap()) infoWindow.current.close();
    infoWindow.current?.open(map.current!, anchor);
    if (!root.current) {
      const el = document.getElementById("infowindow")!;
      root.current = createRoot(el);
    }
    root.current.render(component);
  }

  return { openInfoWindow, resetInfoWindow };
}
