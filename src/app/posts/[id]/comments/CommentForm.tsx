import { Button, Form, Input } from "antd";
import Comment from "./Comment";
import { getPostDetail } from "@/libs/api/test";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const { TextArea } = Input;

export default function CommentForm() {
  const params = useParams();
  const { data } = useQuery({
    queryKey: ["posts", params.id],
    queryFn: getPostDetail,
    suspense: true,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm<{ value: string }>();
  const disableBtn = !Form.useWatch("value", form);

  function handleFinish({ value }: { value: string }) {
    console.log(value);
    form.setFieldValue("value", "");
    if (isEdit) setIsEdit(false);
  }

  function handleEdit(value: string) {
    form.setFieldValue("value", value);
    setIsEdit(true);
  }

  return (
    <>
      <Form
        form={form}
        className="bg-gray-100 flex p-2"
        onFinish={handleFinish}
      >
        <Form.Item name="value" className="mb-0 flex-grow">
          <TextArea />
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
      <div className="p-4 space-y-6">
        {Array(10)
          .fill(0)
          .map((v, i) => (
            <Comment key={i} handleEdit={handleEdit} />
          ))}
      </div>
    </>
  );
}
