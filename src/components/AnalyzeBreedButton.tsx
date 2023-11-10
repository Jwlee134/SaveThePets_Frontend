import { Button, FormInstance, message } from "antd";
import { useState } from "react";
import { FileObj, PostFormValues } from "./PostForm";
import { useMutation } from "@tanstack/react-query";
import { breeds } from "@/libs/constants";
import { createAnalyzedBreed } from "@/libs/api";

export default function AnalyzeBreedButton({
  form,
}: {
  form: FormInstance<PostFormValues>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: createAnalyzedBreed,
    onSuccess(data) {
      const speciesBreed = form.getFieldValue("speciesBreed");
      message.success({
        content: `품종 ${breeds[speciesBreed[0]][data]} 적용 완료.`,
      });
      form.setFieldValue("speciesBreed", [speciesBreed[0], data]);
    },
    onSettled() {
      setIsLoading(false);
    },
    useErrorBoundary: true,
  });

  function handleClick() {
    const images: FileObj[] = form.getFieldValue("photos");
    const speciesBreed = form.getFieldValue("speciesBreed");
    if (!images?.length) {
      message.warning({ content: "사진을 추가하세요." });
      return;
    }
    if (speciesBreed?.[0] === undefined) {
      message.warning({ content: "종을 선택하세요." });
      return;
    }
    setIsLoading(true);
    const data = new FormData();
    images.forEach((item, i) => {
      data.append(`image${i + 1}`, item.data);
    });
    data.append("species", speciesBreed[0]);
    mutate(data);
  }

  return (
    <Button loading={isLoading} className="ml-4" onClick={handleClick}>
      품종 분석
    </Button>
  );
}
