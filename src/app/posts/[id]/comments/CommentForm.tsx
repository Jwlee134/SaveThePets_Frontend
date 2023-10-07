import { createComment, getPostDetail, updateComment } from "@/libs/api";
import { PostDetailResponse } from "@/libs/api/types";
import useIsReady from "@/libs/hooks/useIsReady";
import useMe from "@/libs/hooks/useMe";
import useBoundStore from "@/libs/store";
import usePersistStore from "@/libs/store/usePersistStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
const { TextArea } = Input;

export default function CommentForm() {
  const me = useMe();
  const params = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["posts", params.id],
    queryFn: getPostDetail,
  });
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const { isEdit, id, value, disableEditMode } = useBoundStore(
    ({ comment }) => ({
      isEdit: comment.isEdit,
      id: comment.id,
      value: comment.value,
      disableEditMode: comment.disableEditMode,
    }),
    shallow
  );
  const isReady = useIsReady();
  const [form] = Form.useForm<{ value: string }>();

  function onSettled() {
    queryClient.invalidateQueries({ queryKey: ["posts", params.id] });
    form.setFieldValue("value", "");
  }

  const { mutate: create, isLoading } = useMutation({
    mutationFn: createComment,
    useErrorBoundary: true,
    onSuccess(data) {
      if (!data) message.warning({ content: "댓글 등록에 실패했습니다." });
      else onSettled();
    },
  });
  const { mutate: update } = useMutation({
    mutationFn: updateComment,
    useErrorBoundary: true,
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey: ["posts", params.id] });
      const prevData: PostDetailResponse = queryClient.getQueryData([
        "posts",
        params.id,
      ])!;
      form.setFieldValue("value", "");
      queryClient.setQueryData(["posts", params.id], {
        ...prevData,
        comments: prevData.comments.map((comment) =>
          comment.commentId === id ? { ...comment, content } : comment
        ),
      });
      return { prevData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["posts", params.id], context?.prevData);
    },
    onSettled() {
      onSettled();
      disableEditMode();
    },
  });

  function handleFinish({ value }: { value: string }) {
    if (!me || !data) return;
    if (!isEdit) {
      create({
        content: value,
        postId: parseInt(params.id as string),
        userId: data.userid,
      });
    } else {
      update({
        content: value,
        commentId: id,
      });
    }
  }

  // 수정 버튼 클릭 시 실행
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
        <Form.Item
          name="value"
          className="mb-0 flex-grow"
          rules={[{ required: true, message: "필수 항목입니다." }]}
        >
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
          <Button className="ml-2" htmlType="submit" loading={isLoading}>
            {isEdit ? "수정" : "등록"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
