import { Metadata } from "next";
import Kakao from "./Kakao";

export const metadata: Metadata = {
  title: "로그인 중...",
};

export default function Page() {
  return <Kakao />;
}
