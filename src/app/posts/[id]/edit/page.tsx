import { Metadata } from "next";
import Edit from "./Edit";

export const metadata: Metadata = {
  title: "게시글 수정",
};

export default function Page() {
  return <Edit />;
}
