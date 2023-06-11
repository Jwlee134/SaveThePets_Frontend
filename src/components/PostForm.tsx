"use client";

import { Button, Cascader, DatePicker, Form, Input, TimePicker } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import Photos from "./Photos";
import FormMap from "./FormMap";
import useBoundStore from "@/libs/store";
import { shallow } from "zustand/shallow";
import { postFormTable, speciesBreedsOption } from "@/libs/constants";

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
  initialFileList?: FileObj[];
  handleSubmit: (data: PostFormValues) => void;
  isLoading: boolean;
}

export default function PostForm({
  buttonText = "업로드",
  initialFileList,
  handleSubmit,
  isLoading,
}: PostFormProps) {
  const {
    time: initialTime,
    content,
    species,
    breed,
  } = useBoundStore(
    ({ postForm }) => ({
      time: postForm.time,
      content: postForm.content,
      species: postForm.species,
      breed: postForm.breed,
    }),
    shallow
  );
  const [form] = Form.useForm<PostFormValues>();
  const param = useSearchParams().get("type")!;

  useEffect(() => {
    if (initialFileList) form.setFieldValue("photos", initialFileList);
  }, [initialFileList, form]);

  return (
    <div className="p-4">
      <Form
        form={form}
        labelCol={{ span: 24 }}
        initialValues={{
          ...(initialTime && { date: dayjs(initialTime) }),
          ...(initialTime && { time: dayjs(initialTime) }),
          ...(content && { content }),
          ...(species !== null && {
            speciesBreed: [species, ...(breed !== null ? [breed] : [])],
          }),
        }}
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
                if (!value)
                  return Promise.reject(new Error("필수 항목입니다."));
                return Promise.resolve();
              },
            },
          ]}
        >
          <Photos />
        </Form.Item>
        {param !== "distributed" && (
          <>
            <Form.Item name="speciesBreed" label="종 및 품종">
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
              <FormMap />
            </Form.Item>
          </>
        )}
        <Form.Item
          label={
            <div>
              {postFormTable[param][0]}{" "}
              <span className="text-gray-400">
                ({param === "distributed" ? "필수" : "선택"})
              </span>
            </div>
          }
          name="content"
          rules={
            param === "distributed"
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
