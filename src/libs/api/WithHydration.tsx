import { Hydrate, QueryFunction, dehydrate } from "@tanstack/react-query";
import getQueryClient from "./getQueryClient";
import { ReactNode } from "react";

interface WithHydrationProps {
  queryKey: string[];
  fetchFn: QueryFunction;
}

export default function WithHydration(
  children: ReactNode,
  { queryKey, fetchFn }: WithHydrationProps
) {
  return async function () {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(queryKey, fetchFn);
    const dehydratedState = dehydrate(queryClient);

    return <Hydrate state={dehydratedState}>{children}</Hydrate>;
  };
}
