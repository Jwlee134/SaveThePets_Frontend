import PostForm, { PostFormValues } from "@/components/PostForm";

export default function Page() {
  function handleSubmit(data: PostFormValues) {}

  return <PostForm handleSubmit={handleSubmit} />;
}
