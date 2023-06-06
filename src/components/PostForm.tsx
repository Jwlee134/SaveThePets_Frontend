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

export interface PostFormValues {
  date: dayjs.Dayjs;
  time: dayjs.Dayjs;
  etc: string;
  speciesBreed: string[];
  photos: FileObj[];
  coords: number[];
}

export type FileObj = { data: File; id: string; url: string };

interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}

const { TextArea } = Input;

const table: { [key: string]: string[] } = {
  missed: ["부가 정보", "잃어버린 시간", "잃어버린 장소"],
  witnessed: ["부가 정보", "목격한 시간", "목격한 장소"],
  saved: ["부가 정보", "목격한 시간", "보호중인 장소"],
  distributed: ["반려동물 정보"],
};

const cascaderOptions: CascaderOption[] = [
  {
    value: 0,
    label: "개",
    children: [
      { value: 0, label: "말티즈" },
      { value: 1, label: "치와와" },
    ],
  },
  {
    value: 1,
    label: "고양이",
    children: [
      { value: 0, label: "노르웨이숲" },
      { value: 1, label: "코리안숏헤어" },
    ],
  },
];

interface PostFormProps {
  buttonText?: string;
  initialFileList?: FileObj[];
  handleSubmit: (data: PostFormValues) => void;
}

export default function PostForm({
  buttonText = "업로드",
  initialFileList,
  handleSubmit,
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
  const fileList = Form.useWatch("photos", form);
  const coords = Form.useWatch("coords", form);
  const date = Form.useWatch("date", form);
  const time = Form.useWatch("time", form);
  const param = useSearchParams().get("type")!;
  const disableButton = !fileList?.length || !coords?.length || !date || !time;

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
          ...(content && { etc: content }),
          ...(species !== null && {
            speciesBreed: [species, ...(breed !== null ? [breed] : [])],
          }),
        }}
      >
        <Form.Item
          name="photos"
          label={
            <div>
              사진 <span className="text-gray-400">(필수 • 최대 10장)</span>
            </div>
          }
        >
          <Photos />
        </Form.Item>
        {param !== "distributed" && (
          <>
            <Form.Item name="speciesBreed" label="종 및 품종">
              <Cascader options={cascaderOptions} changeOnSelect />
            </Form.Item>
            <Form.Item
              label={
                <div>
                  {table[param][1]}{" "}
                  <span className="text-gray-400">(필수)</span>
                </div>
              }
              className="mb-0"
            >
              <Form.Item name="date" className="inline-block w-full">
                <DatePicker className="w-full" locale={locale} inputReadOnly />
              </Form.Item>
              <Form.Item name="time" className="inline-block w-full">
                <TimePicker className="w-full" locale={locale} inputReadOnly />
              </Form.Item>
            </Form.Item>
            <div className="h-8 mb-2">
              {table[param][2]} <span className="text-gray-400">(필수)</span>
            </div>
            <Form.Item name="coords">
              <FormMap />
            </Form.Item>
          </>
        )}
        <Form.Item
          label={
            <div>
              {table[param][0]}{" "}
              <span className="text-gray-400">
                ({param === "distributed" ? "필수" : "선택"})
              </span>
            </div>
          }
          name="etc"
        >
          <TextArea showCount maxLength={500} className="h-32" />
        </Form.Item>
        <Button
          htmlType="submit"
          block
          className="mt-6"
          disabled={disableButton}
          onClick={() => handleSubmit(form.getFieldsValue())}
        >
          {buttonText}
        </Button>
      </Form>
    </div>
  );
}
