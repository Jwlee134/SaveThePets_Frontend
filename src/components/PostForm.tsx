"use client";

import { Button, Cascader, DatePicker, Form, Input, TimePicker } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import Photos from "./Photos";
import FormMap from "./FormMap";
import { postFormTable, speciesBreedsOption } from "@/libs/constants";
import { PostDetailResponse } from "@/libs/api/types";
import { getBase64 } from "@/libs/utils";

export interface PostFormValues {
  date: dayjs.Dayjs;
  time: dayjs.Dayjs;
  content: string;
  speciesBreed: number[];
  photos: FileObj[];
  coords: number[];
}

export type FileObj = { data: File; id: string; url: string };

const { TextArea } = Input;

interface PostFormProps {
  buttonText?: string;
  handleSubmit: (data: PostFormValues) => void;
  isLoading: boolean;
  initialData?: PostDetailResponse | undefined;
}

export default function PostForm({
  buttonText = "업로드",
  handleSubmit,
  isLoading,
  initialData,
}: PostFormProps) {
  const [form] = Form.useForm<PostFormValues>();
  const param = useSearchParams().get("type")!;

  // 수정 페이지일 경우 초기 데이터 설정
  useEffect(() => {
    if (!initialData) return;
    Promise.all(
      initialData.pictures.map((photo, i) =>
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
        form.setFieldValue("photos", res);
      })
    );
    form.setFieldsValue({
      ...(initialData?.time && {
        date: dayjs(initialData.time),
        time: dayjs(initialData.time),
      }),
      ...(initialData?.content && { content: initialData.content }),
      ...(typeof initialData?.species === "number" && {
        speciesBreed: [initialData.species, initialData.breed],
      }),
      ...(initialData?.lat && { lat: initialData.lat }),
      ...(initialData?.lot && { lng: initialData.lot }),
    });
  }, [initialData, form]);

  return (
    <div className="p-4">
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={(v) => {
          handleSubmit(v);
        }}
      >
        <Form.Item
          name="photos"
          label={
            <div>
              사진 <span className="text-gray-400">(필수 • 최대 10장)</span>
            </div>
          }
          rules={[
            {
              required: true,
              message: "필수 항목입니다.",
              validator(_, value) {
                if (!value || !value?.length)
                  return Promise.reject(new Error("필수 항목입니다."));
                return Promise.resolve();
              },
            },
          ]}
        >
          <Photos />
        </Form.Item>
        {param !== "3" && (
          <>
            <Form.Item
              name="speciesBreed"
              label="종 및 품종"
              rules={[
                {
                  required: true,
                  message: "필수 항목입니다.",
                  validator(_, value) {
                    if (!value || value?.length < 2)
                      return Promise.reject(new Error("필수 항목입니다."));
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Cascader options={speciesBreedsOption} changeOnSelect />
            </Form.Item>
            <Form.Item
              label={
                <div>
                  {postFormTable[param][1]}{" "}
                  <span className="text-gray-400">(필수)</span>
                </div>
              }
              className="mb-0"
            >
              <Form.Item
                name="date"
                className="inline-block w-full"
                rules={[{ required: true, message: "필수 항목입니다." }]}
              >
                <DatePicker className="w-full" locale={locale} inputReadOnly />
              </Form.Item>
              <Form.Item
                name="time"
                className="inline-block w-full"
                rules={[{ required: true, message: "필수 항목입니다." }]}
              >
                <TimePicker className="w-full" locale={locale} inputReadOnly />
              </Form.Item>
            </Form.Item>
            <div className="h-8 mb-2">
              {postFormTable[param][2]}{" "}
              <span className="text-gray-400">(필수)</span>
            </div>
            <Form.Item
              name="coords"
              rules={[
                {
                  required: true,
                  validator(_, value) {
                    if (!value)
                      return Promise.reject(new Error("필수 항목입니다."));
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <FormMap initialData={initialData} />
            </Form.Item>
          </>
        )}
        <Form.Item
          label={
            <div>
              {postFormTable[param][0]}{" "}
              <span className="text-gray-400">
                ({param === "3" ? "필수" : "선택"})
              </span>
            </div>
          }
          name="content"
          rules={
            param === "3"
              ? [{ required: true, message: "필수 항목입니다." }]
              : undefined
          }
        >
          <TextArea showCount maxLength={500} className="h-32" />
        </Form.Item>
        <Button htmlType="submit" block className="mt-6" loading={isLoading}>
          {buttonText}
        </Button>
      </Form>
    </div>
  );
}
