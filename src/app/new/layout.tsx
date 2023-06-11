"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";
import { convertToType } from "@/libs/utils";

export const table: { [key: string]: string } = {
  missed: "실종 게시글 작성",
  witnessed: "목격 게시글 작성",
  saved: "보호 게시글 작성",
  distributed: "분양 게시글 작성",
};

export default function Layout({ children }: { children: ReactNode }) {
  const param = useSearchParams().get("type") || "default";
  const router = useRouter();
  const isInvalid = param === "default" || convertToType(param) === -1;

  useLayoutEffect(() => {
    if (isInvalid) router.back();
  }, [isInvalid, router]);

  return (
    <>
      <Header showBackBtn title={table[param]} />
      {!isInvalid && children}
    </>
  );
}
