import { Metadata } from "next";
import MyPage from "./MyPage";

export const metadata: Metadata = {
  title: "내 정보",
};

export default function Page() {
  return <MyPage />;
}
