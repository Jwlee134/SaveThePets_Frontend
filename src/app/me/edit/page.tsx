"use client";

import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { Avatar, Button, Form, Input, Upload } from "antd";
import { useState } from "react";
import useIsReady from "@/libs/hooks/useIsReady";

export default function Page() {
  const isReady = useIsReady();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [thumbnail, setThumbnail] = useState("");

  function onFinish({ nickname }: { nickname: string }) {
    if (file) {
      /*  const formData = new FormData();
      formData.append("image", file as RcFile); */
    }
    console.log(nickname);
  }

  if (!isReady) return null;
  return (
    <Form
      className="h-[var(--fit-screen)] p-6 flex flex-col justify-between"
      onFinish={onFinish}
      requiredMark={false}
    >
      <div className="flex flex-col items-center">
        <Avatar size={128} src={thumbnail} className="mb-2" />
        <Form.Item>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              setFile(file);
              const reader = new FileReader();
              reader.onload = (e) => {
                if (typeof e.target?.result === "string")
                  setThumbnail(e.target.result);
              };
              reader.readAsDataURL(file);
              return false;
            }}
            className="text-gray-400"
          >
            사진 변경
          </Upload>
        </Form.Item>
        <Form.Item
          name="nickname"
          label="닉네임"
          rules={[{ required: true, message: "닉네임은 필수입니다." }]}
          className="w-full"
          initialValue={"asdf"}
        >
          <Input showCount maxLength={20} />
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        block
        className="flex items-center justify-center"
      >
        수정
      </Button>
    </Form>
  );
}
