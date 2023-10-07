"use client";

import { Avatar, Button, Form, Input, message } from "antd";
import { ChangeEvent } from "react";
import { FileObj } from "@/components/PostForm";
import useMe from "@/libs/hooks/useMe";
import { getBase64 } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { updateAvatar, updateNickname } from "@/libs/api";
import { AiOutlineUser } from "react-icons/ai";

interface Data {
  avatar: FileObj;
  nickname: string;
}

export default function EditMe() {
  const me = useMe();
  const [form] = Form.useForm<Data>();
  const avatar = Form.useWatch("avatar", form);
  const { mutate: updateNick, isLoading: isNickLoading } = useMutation({
    mutationFn: updateNickname,
    useErrorBoundary: true,
    onSuccess(ok) {
      if (!ok) {
        message.warning({ content: "이미 존재하는 닉네임입니다." });
      } else {
        if (avatar) {
          const formData = new FormData();
          formData.append("picture", avatar.data);
          updateAva(formData);
        } else {
          message.success({ content: "수정되었습니다." });
        }
      }
    },
  });
  const { mutate: updateAva, isLoading: isAvaLoading } = useMutation({
    mutationFn: updateAvatar,
    useErrorBoundary: true,
    onSuccess() {
      message.success({ content: "수정되었습니다." });
    },
  });
  const isLoading = isNickLoading || isAvaLoading;

  function handleSubmit({ nickname, avatar }: Data) {
    if (nickname === me?.nickname && !avatar) {
      message.info({ content: "수정할 내용이 없습니다." });
      return;
    }
    updateNick(nickname);
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = await getBase64(file);
    form.setFieldValue("avatar", { id: "0", data: file, url });
  }

  return (
    <Form
      form={form}
      className="h-[var(--fit-screen)] p-6 flex flex-col justify-between"
      requiredMark={false}
      onFinish={handleSubmit}
    >
      <div className="flex flex-col items-center">
        <Avatar
          icon={<AiOutlineUser className="text-7xl" />}
          size={128}
          src={avatar?.url || me?.picture}
          className="flex justify-center items-center shrink-0 mb-2"
        />
        <label htmlFor="avatar" className="text-gray-400 cursor-pointer mt-2">
          사진 변경
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="input-file"
          />
        </label>
        <Form.Item name="avatar">
          <div />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="닉네임"
          rules={[{ required: true, message: "필수 항목입니다." }]}
          className="w-full"
          initialValue={me?.nickname}
        >
          <Input showCount maxLength={20} />
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        block
        className="flex items-center justify-center"
        loading={isLoading}
      >
        수정
      </Button>
    </Form>
  );
}
