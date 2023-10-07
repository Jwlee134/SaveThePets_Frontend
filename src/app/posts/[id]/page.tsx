import WithHydration from "@/libs/api/WithHydration";
import Post from "./Post";
import { getPostDetail } from "@/libs/api";
import { breeds } from "@/libs/constants";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props) {
  const detail = await fetch(`http://localhost:8080/post/${params.id}`).then(
    (res) => res.json()
  );
  return { title: breeds[detail.species][detail.breed] };
}

export default WithHydration(<Post />, {
  queryKey: ({ params }) => ["posts", params.id],
  queryFn: getPostDetail,
});
