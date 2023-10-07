import { Metadata } from "next";
import EditMe from "./EditMe";

export const metadata: Metadata = {
  title: "내 정보 수정",
};

export default function Page() {
  return <EditMe />;
}
