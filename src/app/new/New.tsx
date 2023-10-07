"use client";

import PostForm, { PostFormValues } from "@/components/PostForm";
import { createPost, getAddress } from "@/libs/api";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function New() {
  const param = useSearchParams().get("type");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess(id) {
      setIsLoading(false);
      message.success({ content: "게시글이 생성되었습니다." });
      router.replace(`/posts/${id}`);
    },
    useErrorBoundary: true,
  });

  async function handleSubmit(data: PostFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    for (const photo of data.photos) formData.append("pictures", photo.data);
    if (data?.speciesBreed?.length) {
      formData.append("species", data.speciesBreed[0].toString());
      formData.append("breed", data.speciesBreed[1].toString());
    }
    if (data?.date && data?.time) {
      formData.append(
        "time",
        new Date(
          `${data.date.format("YYYY-MM-DD")}T${data.time.format("HH:mm:ss")}`
        )
          .toISOString()
          .split(".")[0]
      );
    }

    if (data?.coords?.length) {
      const address = (await getAddress(data.coords[0], data.coords[1])).result;
      formData.append("address", address);
      formData.append("lat", data.coords[0].toString());
      formData.append("lot", data.coords[1].toString());
    }
    if (data?.content) formData.append("content", data.content);
    formData.append("type", param!);
    mutate(formData);
  }

  return <PostForm handleSubmit={handleSubmit} isLoading={isLoading} />;
}
