import WithHydration from "@/libs/api/WithHydration";
import Post from "./Post";
import { getPostDetail } from "@/libs/api/test";

export default WithHydration(<Post />, {
  queryKey: ({ params }) => ["posts", params.id],
  queryFn: getPostDetail,
});
