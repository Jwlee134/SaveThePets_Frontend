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
  const [mapQueryStr, setMapQueryStr] = useState("");

  const { data: posts } = useQuery({
    queryKey: ["posts", "map", mapQueryStr],
    queryFn: getPostsMap,
    enabled: !!mapQueryStr,
    useErrorBoundary: true,
  });
  const { data: filteredPosts } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: getFilteredPosts,
    enabled: filterEnabled,
    useErrorBoundary: true,
  });
  const { data: detail, isLoading } = useQuery({
    queryKey: ["posts", clickedId],
    queryFn: getPostDetail,
    enabled: !!clickedId,
    useErrorBoundary: true,
    cacheTime: 0,
  });

  /* 필터 비활성화된 상태에서의 idle event callback */
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
      /* persistStore에 현재 위도, 경도, 줌 저장 */
      setCoords(
        Number(centerLat.toFixed(6)),
        Number(centerLng.toFixed(6)),
        zoom
      );
      /* queryString에 현재 bounds, 중앙 좌표 넣어 상태 갱신하여 일반 게시글 useQuery 호출 */
      setMapQueryStr(
        new URLSearchParams({
          centerLat: centerLat.toFixed(6),
          centerLng: centerLng.toFixed(6),
          rightUpLat: neLat.toFixed(6),
          rightUpLot: neLng.toFixed(6),
          leftDownlat: swLat.toFixed(6),
          leftDownlot: swLng.toFixed(6),
        }).toString()
      );
    },
    [setCoords]
  );

  /* 필터 활성화된 상태에서의 idle event callback */
  const idleEventCallbackFiltered = useCallback(
    ({ centerLat, centerLng, zoom }: IdleCallbackArgs) => {
      /* persistStore에 현재 위도, 경도, 줌 저장 */
      setCoords(
        Number(centerLat.toFixed(6)),
        Number(centerLng.toFixed(6)),
        zoom
      );
      /* 필터 항목들은 쿼리스트링에 저장되므로 router.replace()를 호출해야 함
      지도를 이동할 때마다 쿼리스트링의 현재 좌표를 변경함 */
      const instance = new URLSearchParams(window.location.search);
      instance.set("userLat", centerLat.toFixed(6));
      instance.set("userLot", centerLng.toFixed(6));
      router.replace(`/?${instance.toString()}`);
    },
    [router, setCoords]
  );

  const setMarkers = useCallback(
    (data: PostResponse[]) => {
      // 새로 받아온 데이터에 기존 마커와 동일한 데이터가 없다면 삭제
      markers.current = markers.current.filter((mk, i) => {
        const idx = data.findIndex(
          (item) => item.postId.toString() === mk.getTitle()
        );
        if (idx == -1) {
          markers.current[i].setMap(null);
          return false;
        }
        return true;
      });
      setMarkerNodesArr((prev) => {
        return prev.filter((node) => {
          const idx = data.findIndex(
            (item) => item.postId.toString() === node.id
          );
          if (idx == -1) return false;
          return true;
        });
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
          /* 게시글 좌표로 마커 생성 */
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(post.postLat, post.postLot),
            map: map.current,
            icon: {
              content: `<div id="${post.postId}" />`,
              size: new naver.maps.Size(80, 80),
              anchor: new naver.maps.Point(40, 40),
            },
            title: post.postId.toString(), // title에 게시글 id 저장
          });
          const node = document.getElementById(post.postId.toString());
          if (node) {
            markers.current.push(marker);
            // 생성된 마커 노드를 실제 지도에 표시하기위한 리액트 노드의 배열에 저장
            setMarkerNodesArr((prev) => [
              ...prev,
              { id: post.postId.toString(), node, thumbUrl: post.picture },
            ]);
          }
          naver.maps.Event.addListener(marker, "click", () => {
            // 마커 클릭 시 인포윈도우를 생성하기 위한 현재 게시글 정보 저장
            clickedMarker.current = post;
            // clickedId에 의존하는 게시글 세부 정보를 가져오는 useQuery 실행을 위한 setClickedId 호출
            setClickedId(parseInt(marker.getTitle()));
          });
        });
    },
    [map]
  );

  /* 
    TODO: 타임라인 보여지고 있는 상테에서 페이지 벗어나고 다시 돌아와도 기존 타임라인 보여질 수 있게
    zustand에 전역으로 저장하는 로직 추가
*/

  // 마커 클릭 시 게시글 세부 정보 API 요청하며 타임라인 보여주고 클릭된 마커의 인포윈도우 생성
  useEffect(() => {
    if (!detail || !clickedMarker.current) return;
    unregisterIdleEvent(); // idle event 해제
    markers.current.forEach(hideMarker); // 모든 마커 숨김
    const { breed, picture, postId, species, time, postLat, postLot, type } =
      clickedMarker.current; // 클릭 시 저장된 게시글 정보로 인포윈도우 및 첫 번째 타임라인 마커 생성
    openInfoWindow(new naver.maps.LatLng(postLat, postLot), {
      breed,
      species,
      id: postId,
      picture,
      time,
      type,
    });
    setTimelineMarkers([
      {
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
        markers.current.forEach((mk) => showMarker(map, mk)); // 기존 마커들 다시 표시
        registerIdleEvent(
          filterEnabled ? idleEventCallbackFiltered : idleEventCallback,
          filterEnabled ? undefined : true
        ); // 기존에 있던 idle event 재등록
        setClickedId(0); // 클릭된 id 초기화
      },
    }); // setTimelineMarkers의 호출 결과로 리턴되는 지도 클릭 이벤트 함수 호출
    return () => {
      /* filterEnabled가 의존성에 들어갔으므로 타임라인 보여지는 동안 필터 활성화 및 비활성화 시
      중복 생성 방지를 위한 clean up 함수를 리턴해주어야 한다. */
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

  /* 필터 비활성화된 상태에서 지도 움직일 경우 일반 게시글들로 마커 갱신 */
  useEffect(() => {
    if (map.current && posts && !filterEnabled) setMarkers(posts);
  }, [map, posts, filterEnabled, setMarkers]);

  /* 필터 활성화된 상태에서 지도 움직일 경우 필터 게시글들로 마커 갱신 */
  useEffect(() => {
    if (map.current && filteredPosts && filterEnabled)
      setMarkers(filteredPosts);
  }, [map, filteredPosts, filterEnabled, setMarkers]);

  /* 
    필터가 활성화되지 않은 상태라면 idle event에 idleEventCallback 등록,
    필터가 활성화된 상태라면 idle event에 idleEventCallbackFiltered 등록,
  */
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

  return (
    <div ref={ref} className="h-[var(--fit-screen)] relative">
      <MyLocationButton mapRef={map} />
      {markerNodesArr.length > 0 &&
        markerNodesArr.map(({ id, node, thumbUrl }) =>
          createPortal(
            <Marker
              url={thumbUrl}
              isLoading={id === clickedId.toString() && isLoading}
            />,
            node,
            id
          )
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
