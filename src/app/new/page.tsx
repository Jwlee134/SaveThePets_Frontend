import { Metadata } from "next";
import New from "./New";

export const metadata: Metadata = {
  title: "게시글 작성",
};

export default function Page() {
  return <New />;
}
