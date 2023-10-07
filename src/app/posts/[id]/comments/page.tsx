import { Metadata } from "next";
import Comments from "./Comments";

export const metadata: Metadata = {
  title: "댓글",
};

export default function Page() {
  return <Comments />;
}
