"use client";

import PostForm, { PostFormValues } from "@/components/PostForm";
import { getAddress, getPostDetail, updatePost } from "@/libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const param = useSearchParams().get("type") || "default";
  const router = useRouter();
  const isInvalid =
    param === "default" ||
    (param !== "0" && param !== "1" && param !== "2" && param !== "3");
  const { data } = useQuery({
    queryFn: getPostDetail,
    queryKey: ["posts", id],
    useErrorBoundary: true,
    suspense: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: updatePost,
    onSuccess() {
      message.success({ content: "수정되었습니다." });
      router.back();
    },
    onSettled() {
      setIsLoading(false);
    },
    useErrorBoundary: true,
  });

  async function handleSubmit(data: PostFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("postId", id);
    for (const photo of data.photos) formData.append("pictures", photo.data);
    formData.append("species", data.speciesBreed[0].toString());
    formData.append("breed", data.speciesBreed[1].toString());
    if (data.date && data.time)
      formData.append(
        "time",
        new Date(
          `${data.date.format("YYYY-MM-DD")}T${data.time.format("HH:mm:ss")}`
        )
          .toISOString()
          .split(".")[0]
      );
    if (data.coords) {
      const address = (await getAddress(data.coords[0], data.coords[1])).result;
      formData.append("address", address);
      formData.append("postLat", data.coords[0].toString());
      formData.append("postLot", data.coords[1].toString());
    }
    if (data.content) formData.append("content", data.content);
    formData.append("type", param);
    mutate(formData);
  }

  useEffect(() => {
    if (isInvalid) router.back();
  }, [isInvalid, router]);

  if (isInvalid) return null;
  return (
    <PostForm
      buttonText="수정"
      initialData={data}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
