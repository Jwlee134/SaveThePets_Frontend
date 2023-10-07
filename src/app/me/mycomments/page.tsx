import { Metadata } from "next";
import MyComments from "./MyComments";

export const metadata: Metadata = {
  title: "작성한 댓글",
};

export default function Page() {
  return <MyComments />;
}
