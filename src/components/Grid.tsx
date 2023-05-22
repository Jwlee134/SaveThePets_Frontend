import { getPosts } from "@/libs/api/test";
import { useQuery } from "@tanstack/react-query";
import GridItem from "./GridItem";

export default function Grid() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {data?.map((item) => (
        <GridItem key={item.id} />
      ))}
    </div>
  );
}
