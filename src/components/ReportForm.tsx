"use client";

import { Button, Form, Input, Radio } from "antd";
import { useParams } from "next/navigation";

export default function ReportForm() {
  const params = useParams();
  const [form] = Form.useForm();
  const disableTextArea = Form.useWatch("radio", form) !== "4";
  const disableBtn = !Form.useWatch("radio", form);

  function handleFinish({ radio, text }: { radio: string; text?: string }) {
    console.log(radio, text, params);
  }

  return (
    <Form
      form={form}
      className="p-6 h-[var(--fit-screen)] flex flex-col justify-between"
      onFinish={handleFinish}
    >
      <div>
        <div className="text-lg mb-2">신고 사유를 선택하세요.</div>
        <Form.Item name="radio">
          <Radio.Group className="space-y-2">
            <div>
              <Radio value="1">게시글과 관련없는 내용</Radio>
            </div>
            <div>
              <Radio value="2">광고/스팸</Radio>
            </div>
            <div>
              <Radio value="3">욕설/비하</Radio>
            </div>
            <div>
              <Radio value="4">기타</Radio>
            </div>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="text"
          rules={[
            { required: !disableTextArea, message: "내용을 작성해주세요." },
          ]}
        >
          <Input.TextArea
            style={{ resize: "none", height: 160 }}
            disabled={disableTextArea}
          />
        </Form.Item>
      </div>
      <Form.Item className="mb-0">
        <Button block htmlType="submit" disabled={disableBtn}>
          신고
        </Button>
      </Form.Item>
    </Form>
  );
}
