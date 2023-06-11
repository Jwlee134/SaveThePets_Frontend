import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Marker from "./Marker";
import { useQuery } from "@tanstack/react-query";
import useMap, { IdleCallbackArgs } from "@/libs/hooks/useMap";
import { hideMarker, showMarker } from "@/libs/utils";
import useTimeline from "@/libs/hooks/useTimeline";
import usePersistStore from "@/libs/store/usePersistStore";
import MyLocationButton from "./MyLocationButton";
import { createPortal } from "react-dom";
import TimelineMarker from "./TimelineMarker";
import InfoWindow from "./InfoWindow";
import { useRouter, useSearchParams } from "next/navigation";
import { getFilteredPosts, getPostDetail, getPostsMap } from "@/libs/api";
import { PostResponse } from "@/libs/api/types";

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { map, panToBounds, registerIdleEvent, unregisterIdleEvent } =
    useMap(ref);
  const {
    infoWindowObj,
    openInfoWindow,
    timelineNodesArr,
    setTimelineMarkers,
    resetInfoWindow,
    resetTimelineAndPolylines,
  } = useTimeline(map, panToBounds);
  const setCoords = usePersistStore((state) => state.setCoords);
  const searchParams = useSearchParams();
  // 쿼리스트링 생기면 필터 모달에서 필터 설정 후 router.replace() 호출했다는 것이므로 필터 API 활성화
  const filterEnabled = !!searchParams.toString();
  const router = useRouter();
  const markers = useRef<naver.maps.Marker[]>([]);
  const clickedMarker = useRef<PostResponse | null>(null);
  const [markerNodesArr, setMarkerNodesArr] = useState<
    { id: string; node: HTMLElement; thumbUrl: string }[]
  >([]);
  const [clickedId, setClickedId] = useState(0);

  const { data: posts, refetch: fetchPosts } = useQuery({
    queryKey: ["posts", "map"],
    queryFn: getPostsMap,
    enabled: false,
  });
  const { data: filteredPosts } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: getFilteredPosts,
    enabled: filterEnabled,
  });
  const { data: detail } = useQuery({
    queryKey: ["posts", clickedId],
    queryFn: getPostDetail,
    enabled: !!clickedId,
  });

  const showVisibleMarkersOnly = useCallback(() => {
    if (!map.current) return;
    const mapBounds = map.current.getBounds();
    markers.current.forEach((marker) => {
      const pos = marker.getPosition();
      if (mapBounds.hasPoint(pos)) showMarker(map, marker);
      else hideMarker(marker);
    });
  }, [map]);

  const idleEventCallback = useCallback(
    ({
      centerLat,
      centerLng,
      neLat,
      neLng,
      swLat,
      swLng,
      zoom,
    }: IdleCallbackArgs) => {
      setCoords(
        Number(centerLat.toFixed(6)),
        Number(centerLng.toFixed(6)),
        zoom
      );
      fetchPosts({
        queryKey: [
          "posts",
          "map",
          new URLSearchParams({
            centerLat: centerLat.toFixed(6),
            centerLng: centerLng.toFixed(6),
            rightUpLat: neLat.toFixed(6),
            rightUpLot: neLng.toFixed(6),
            leftDownlat: swLat.toFixed(6),
            leftDownlot: swLng.toFixed(6),
          }).toString(),
        ],
      });
      showVisibleMarkersOnly();
    },
    [setCoords, fetchPosts, showVisibleMarkersOnly]
  );

  const idleEventCallbackFiltered = useCallback(
    ({ centerLat, centerLng, zoom }: IdleCallbackArgs) => {
      setCoords(
        Number(centerLat.toFixed(6)),
        Number(centerLng.toFixed(6)),
        zoom
      );
      const instance = new URLSearchParams(window.location.search);
      instance.set("userLat", centerLat.toFixed(6));
      instance.set("userLot", centerLng.toFixed(6));
      router.replace(`/?${instance.toString()}`);
      showVisibleMarkersOnly();
    },
    [router, setCoords, showVisibleMarkersOnly]
  );

  function setMarkers(
    data: PostResponse[],
    map: naver.maps.Map,
    markers: MutableRefObject<naver.maps.Marker[]>
  ) {
    // 새로 받아온 데이터에 기존 마커와 동일한 데이터가 없다면 삭제
    markers.current = markers.current.filter((mk, i) => {
      const idx = data.findIndex(
        (item) => item.postId.toString() === mk.getTitle()
      );
      if (idx == -1) {
        markers.current[i].setMap(null);
        setMarkerNodesArr((prev) => {
          const copied = [...prev];
          copied.splice(i, 1);
          return copied;
        });
        return false;
      }
      return true;
    });
    data
      .filter(
        // 이미 존재하는 마커의 중복 생성 방지 위해 filter
        (post) =>
          !markers.current.some(
            (mk) => post.postId.toString() === mk.getTitle()
          )
      )
      .forEach((post) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(post.postLat, post.postLot),
          map,
          icon: {
            content: `<div id="${post.postId}" />`,
            size: new naver.maps.Size(72, 72),
            anchor: new naver.maps.Point(36, 72),
          },
          title: post.postId.toString(),
        });
        const node = document.getElementById(post.postId.toString());
        if (node)
          setMarkerNodesArr((prev) => [
            ...prev,
            { id: post.postId.toString(), node, thumbUrl: post.picture },
          ]);
        naver.maps.Event.addListener(marker, "click", () => {
          clickedMarker.current = post;
          setClickedId(parseInt(marker.getTitle()));
        });
        markers.current.push(marker);
      });
  }

  // 마커 클릭 시 타임라인 보여주며 클릭된 마커의 인포윈도우 생성
  useEffect(() => {
    if (!detail || !clickedMarker.current) return;
    unregisterIdleEvent();
    markers.current.forEach(hideMarker);
    const { address, breed, picture, postId, species, time, postLat, postLot } =
      clickedMarker.current;
    openInfoWindow(new naver.maps.LatLng(postLat, postLot), {
      address,
      breed,
      species,
      id: postId,
      picture,
      time,
    });
    setTimelineMarkers([
      {
        address,
        breed,
        picture,
        sightingPostId: postId,
        species,
        time,
        postLat,
        postLot,
      },
      ...detail.timeline,
    ])({
      customResetAction: () => {
        markers.current.forEach((mk) => showMarker(map, mk));
        registerIdleEvent(
          filterEnabled ? idleEventCallbackFiltered : idleEventCallback,
          filterEnabled ? undefined : true
        );
        setClickedId(0);
      },
    });
    /* 
      filterEnabled가 의존성에 들어갔으므로 타임라인 보여지는 동안 필터 활성화 및 비활성화 시
      중복 생성 방지를 위한 clean up 함수를 리턴해주어야 한다.
    */
    return () => {
      clickedMarker.current = null;
      setClickedId(0);
      resetInfoWindow();
      resetTimelineAndPolylines();
    };
  }, [
    map,
    detail,
    filterEnabled,
    openInfoWindow,
    setTimelineMarkers,
    unregisterIdleEvent,
    idleEventCallback,
    idleEventCallbackFiltered,
    registerIdleEvent,
    resetInfoWindow,
    resetTimelineAndPolylines,
  ]);

  const resetMarkers = useCallback(() => {
    if (markers.current.length) {
      markers.current.forEach((mk) => mk.setMap(null));
      markers.current = [];
      setMarkerNodesArr([]);
    }
  }, []);

  useEffect(() => {
    if (map.current && posts && posts.length && !filterEnabled)
      setMarkers(posts, map.current, markers);
  }, [map, posts, filterEnabled]);

  useEffect(() => {
    if (map.current && filteredPosts && filteredPosts.length && filterEnabled)
      setMarkers(filteredPosts, map.current, markers);
  }, [map, filteredPosts, filterEnabled]);

  useEffect(() => {
    if (!map.current) return;
    if (!filterEnabled) registerIdleEvent(idleEventCallback, true);
    else registerIdleEvent(idleEventCallbackFiltered);
    return () => {
      resetMarkers();
      unregisterIdleEvent();
    };
  }, [
    map,
    filterEnabled,
    registerIdleEvent,
    idleEventCallback,
    idleEventCallbackFiltered,
    unregisterIdleEvent,
    resetMarkers,
  ]);

  useEffect(() => {
    return () => {
      resetMarkers();
    };
  }, [resetMarkers]);

  return (
    <div ref={ref} className="h-[var(--fit-screen)] relative">
      <MyLocationButton mapRef={map} />
      {markerNodesArr.length > 0 &&
        markerNodesArr.map(({ id, node, thumbUrl }) =>
          createPortal(<Marker url={thumbUrl} />, node, id)
        )}
      {timelineNodesArr.length > 0 &&
        timelineNodesArr.map(({ id, node }, i) =>
          createPortal(<TimelineMarker index={i} />, node, id)
        )}
      {infoWindowObj !== null &&
        createPortal(
          <InfoWindow {...infoWindowObj.data} />,
          infoWindowObj.node
        )}
    </div>
  );
}
