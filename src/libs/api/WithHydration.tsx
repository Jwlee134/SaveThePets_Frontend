import { Hydrate, QueryFunction, dehydrate } from "@tanstack/react-query";
import getQueryClient from "./getQueryClient";
import { ReactNode } from "react";

interface PageParams {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface WithHydrationProps {
  queryKey: (arg: PageParams) => string[];
  queryFn: QueryFunction;
}

export default function WithHydration(
  children: ReactNode,
  { queryKey, queryFn }: WithHydrationProps
) {
  return async function (props: PageParams) {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(queryKey(props), queryFn);
    const dehydratedState = dehydrate(queryClient);

    return <Hydrate state={dehydratedState}>{children}</Hydrate>;
  };
}
