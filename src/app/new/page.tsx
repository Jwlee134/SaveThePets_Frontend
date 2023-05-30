"use client";

import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";

import useIsReady from "@/libs/hooks/useIsReady";
import { Button, DatePicker, Form, TimePicker } from "antd";
import { useState } from "react";
import { Input } from "antd";
import FormMap from "./FormMap";
import Photos from "./Photos";
import { useSearchParams } from "next/navigation";

const { TextArea } = Input;

const table: { [key: string]: string[] } = {
  missed: ["부가 정보", "잃어버린 시간", "잃어버린 장소"],
  witnessed: ["부가 정보", "목격한 시간", "목격한 장소"],
  saved: ["부가 정보", "목격한 시간", "보호중인 장소"],
  distributed: ["반려동물 정보"],
};

export type FileObj = { data: File; id: string; url: string };

export default function Page() {
  const param = useSearchParams().get("type")!;
  const isReady = useIsReady();
  const [fileList, setFileList] = useState<FileObj[]>([]);
  const [latLng, setLatLng] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isReady) return null;
  return (
    <>
      <Form
        className="p-6"
        labelCol={{ span: 24 }}
        onFinish={(values) => {
          console.log(values);
        }}
      >
        <Form.Item
          label={
            <div>
              사진 <span className="text-gray-400">(필수 • 최대 10장)</span>
            </div>
          }
        >
          <Photos fileList={fileList} setFileList={setFileList} />
        </Form.Item>
        {param !== "distributed" && (
          <>
            <div className="h-8 mb-2">{table[param][1]}</div>
            <div className="grid grid-cols-2 gap-x-4">
              <DatePicker
                placeholder="날짜 (필수)"
                inputReadOnly
                className=""
                locale={locale}
                onChange={(date, string) => {
                  setDate(string);
                }}
              />
              <TimePicker
                placeholder="시간 (필수)"
                inputReadOnly
                className=""
                locale={locale}
                onChange={(date, string) => {
                  setTime(string);
                }}
              />
            </div>
            <div className="h-8 mb-2 mt-6">
              {table[param][2]} <span className="text-gray-400">(필수)</span>
            </div>
            <FormMap setLatLng={setLatLng} />
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
          disabled={!fileList.length || !latLng.length || !date}
        >
          업로드
        </Button>
      </Form>
    </>
  );
}
