"use client";

import PostForm, { FileObj, PostFormValues } from "@/components/PostForm";
import useBoundStore from "@/libs/store";
import { getBase64 } from "@/libs/utils";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

export default function Page() {
  const { photos, reset } = useBoundStore(
    (state) => ({ photos: state.photos, reset: state.resetValues }),
    shallow
  );
  const [initialFileList, setInitialFileList] = useState<FileObj[]>([]);

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
    return () => {
      reset();
    };
  }, [reset]);

  function handleSubmit({ date, time }: PostFormValues) {
    /* const parsedDate = new Date(
      `${date.format("YYYY-MM-DD")}T${time.format("HH:mm:ss")}`
    ).getTime();
    console.log(parsedDate); */
  }

  return (
    <PostForm
      buttonText="수정"
      initialFileList={initialFileList}
      handleSubmit={handleSubmit}
    />
  );
}

/* 
    TODO
    4. 쿼리 스트링 type 임의로 바꿔서 이상한 값 들어올경우 처리
*/
