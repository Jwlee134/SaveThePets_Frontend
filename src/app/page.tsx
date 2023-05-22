import getQueryClient from "@/libs/api/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import Home from "./Home";
import { getPosts } from "@/libs/api/test";

export default async function HydratedHome() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["posts"], getPosts);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Home />
    </Hydrate>
  );
}
