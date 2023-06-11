import { useQuery } from "@tanstack/react-query";
import GridItem from "./GridItem";
import { getFilteredPosts, getPostsGrid } from "@/libs/api";
import { useSearchParams } from "next/navigation";

export default function Grid() {
  const searchParams = useSearchParams();
  // 쿼리스트링 생기면 필터 모달에서 필터 설정 후 router.replace() 호출했다는 것이므로 필터 API 활성화
  const filterEnabled = !!searchParams.toString();
  const { data } = useQuery({
    queryKey: ["posts", "grid"],
    queryFn: getPostsGrid,
    suspense: true,
    useErrorBoundary: true,
    enabled: !filterEnabled,
  });
  const { data: filteredPosts } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: getFilteredPosts,
    enabled: filterEnabled,
    suspense: true,
    useErrorBoundary: true,
  });

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {(filterEnabled ? filteredPosts : data)?.map((item) => (
        <GridItem key={item.postId} {...item} />
      ))}
    </div>
  );
}
