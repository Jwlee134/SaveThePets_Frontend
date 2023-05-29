"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const param = useSearchParams().get("type") || "default";
  const router = useRouter();

  const table: { [key: string]: string } = {
    missed: "실종 게시글 작성",
    witnessed: "목격 게시글 작성",
    saved: "보호 게시글 작성",
    distributed: "분양 게시글 작성",
  };

  useLayoutEffect(() => {
    if (param === "default") router.replace("/new?type=missed");
  }, [param, router]);

  return (
    <>
      <Header showBackBtn title={table[param]} />
      {children}
    </>
  );
}
