"use client";

import PostForm, { PostFormValues } from "@/components/PostForm";
import { createPost, getAddress } from "@/libs/api";
import { convertToType } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const param = useSearchParams().get("type");
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess(id) {
      message.success({ content: "게시글이 생성되었습니다." });
      router.replace(`/posts/${id}`);
    },
    useErrorBoundary: true,
  });

  async function handleSubmit(data: PostFormValues) {
    const formData = new FormData();
    const type = convertToType(param!);
    for (const photo of data.photos) formData.append("pictures", photo.data);
    formData.append("species", data.speciesBreed[0].toString());
    formData.append("breed", data.speciesBreed[1].toString());
    if (data.date && data.time)
      formData.append(
        "time",
        new Date(
          `${data.date.format("YYYY-MM-DD")}T${data.time.format("HH:mm:ss")}`
        ).toISOString()
      );
    if (data.coords) {
      const address = (await getAddress(data.coords[0], data.coords[1])).result;
      formData.append("address", address);
      formData.append("lat", data.coords[0].toString());
      formData.append("lot", data.coords[1].toString());
    }
    if (data.content) formData.append("content", data.content);
    formData.append("type", type.toString());
    mutate(formData);
  }

  return <PostForm handleSubmit={handleSubmit} isLoading={isLoading} />;
}
