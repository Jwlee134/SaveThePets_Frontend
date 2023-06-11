import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";

export default function useMe() {
  const { data } = useQuery({
    queryFn: getMe,
    queryKey: ["me"],
  });

  return data;
}
