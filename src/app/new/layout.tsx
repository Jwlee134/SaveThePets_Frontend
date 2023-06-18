"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";

export const table: { [key: string]: string } = {
  "0": "실종 게시글 작성",
  "1": "목격 게시글 작성",
  "2": "보호 게시글 작성",
  "3": "분양 게시글 작성",
};

export default function Layout({ children }: { children: ReactNode }) {
  const param = useSearchParams().get("type") || "default";
  const router = useRouter();
  const isInvalid =
    param === "default" ||
    (param !== "0" && param !== "1" && param !== "2" && param !== "3");

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
