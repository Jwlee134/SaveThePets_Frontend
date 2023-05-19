import Header from "@/components/Header";
import Map from "@/components/Map";
import NewButton from "@/components/NewButton";
import getQueryClient from "@/libs/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import axios from "axios";
import { IoFilterOutline } from "react-icons/io5";

export async function getPosts() {
  return axios
    .get<{ id: string; lat: number; lng: number }[]>(
      "http://localhost:3000/api/list"
    )
    .then((res) => res.data);
}

export async function getTimeline() {
  return axios
    .get<{ id: string; lat: number; lng: number }[]>(
      "http://localhost:3000/api/timeline"
    )
    .then((res) => res.data);
}

function Home() {
  return (
    <>
      <Header
        showLogo
        rightIcons={[
          <NewButton key={0} />,
          <IoFilterOutline key={1} className="text-2xl" />,
        ]}
      />
      <Map />
    </>
  );
}

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
