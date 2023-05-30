"use client";

import Header from "@/components/Header";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment() || "me";

  const headerTitle: { [key: string]: string } = {
    myposts: "작성한 글",
    mycomments: "작성한 댓글",
    mybookmarks: "북마크한 글",
    edit: "내 정보 수정",
    me: "내 정보",
  };

  return (
    <>
      <Header title={headerTitle[segment]} showBackBtn={segment !== "me"} />
      {children}
    </>
  );
}
