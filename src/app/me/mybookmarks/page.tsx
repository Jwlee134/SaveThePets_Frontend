import { Metadata } from "next";
import MyBookmarks from "./MyBookmarks";

export const metadata: Metadata = {
  title: "북마크한 글",
};

export default function Page() {
  return <MyBookmarks />;
}
