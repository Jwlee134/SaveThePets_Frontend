"use client";

import PostForm, { FileObj, PostFormValues } from "@/components/PostForm";
import { updatePost } from "@/libs/api";
import useBoundStore from "@/libs/store";
import { convertToType, getBase64 } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

export default function Page() {
  const { id } = useParams();
  const param = useSearchParams().get("type") || "default";
  const router = useRouter();
  const isInvalid = param === "default" || convertToType(param) === -1;
  const { photos, reset } = useBoundStore(
    ({ postForm }) => ({
      photos: postForm.photos,
      reset: postForm.resetValues,
    }),
    shallow
  );
  const [initialFileList, setInitialFileList] = useState<FileObj[]>([]);
  const { mutate, isLoading } = useMutation({
    mutationFn: updatePost,
    onSuccess() {
      message.success({ content: "게시글이 수정되었습니다." });
      router.back();
    },
    useErrorBoundary: true,
  });

  function handleSubmit(data: PostFormValues) {
    const formData = new FormData();
    const type = convertToType(param!);
    formData.append("postId", id);
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
      formData.append("postLat", data.coords[0].toString());
      formData.append("postLot", data.coords[1].toString());
    }
    if (data.content) formData.append("content", data.content);
    formData.append("type", type.toString());
    mutate(formData);
  }

  useEffect(() => {
    Promise.all(
      photos.map((photo, i) =>
        fetch(photo)
          .then((res) => res.blob())
          .then((blob) => new File([blob], `photo-${i}`, { type: blob.type }))
      )
    ).then((fileList) =>
      Promise.all(
        fileList.map(async (file) => {
          const thumbUrl = await getBase64(file);
          return { data: file, id: `${file.name}-${file.size}`, url: thumbUrl };
        })
      ).then((res) => {
        setInitialFileList(res);
      })
    );
  }, [photos]);

  useEffect(() => {
    if (isInvalid) router.back();
    return () => {
      reset();
    };
  }, [reset, isInvalid, router]);

  if (isInvalid) return null;
  return (
    <PostForm
      buttonText="수정"
      initialFileList={initialFileList}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
