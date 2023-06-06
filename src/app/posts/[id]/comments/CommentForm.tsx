import useIsReady from "@/libs/hooks/useIsReady";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
const { TextArea } = Input;

export default function CommentForm() {
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const { isEdit, id, value, disableEditMode } = useBoundStore(
    (state) => ({
      isEdit: state.isEdit,
      id: state.id,
      value: state.value,
      disableEditMode: state.disableEditMode,
    }),
    shallow
  );
  const isReady = useIsReady();
  const [form] = Form.useForm<{ value: string }>();
  const disableBtn = !Form.useWatch("value", form);

  function handleFinish({ value }: { value: string }) {
    console.log(value);

    if (isEdit) {
      disableEditMode();
    } else {
      form.setFieldValue("value", "");
    }
  }

  useEffect(() => {
    form.setFieldValue("value", value);
  }, [isEdit, value, form]);

  return (
    <>
      <Form
        form={form}
        className="bg-gray-100 flex p-2"
        onFinish={handleFinish}
      >
        <Form.Item name="value" className="mb-0 flex-grow">
          <TextArea
            disabled={!isReady || !isLoggedIn}
            placeholder={
              isReady
                ? !isLoggedIn
                  ? "로그인이 필요한 서비스입니다."
                  : ""
                : ""
            }
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button
            type="primary"
            className="ml-2"
            htmlType="submit"
            disabled={disableBtn}
          >
            {isEdit ? "수정" : "등록"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
