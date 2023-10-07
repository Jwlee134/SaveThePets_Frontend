import { Metadata } from "next";
import MyPosts from "./MyPosts";

export const metadata: Metadata = {
  title: "작성한 글",
};

export default function Page() {
  return <MyPosts />;
}
