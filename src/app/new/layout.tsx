"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";
import { table } from "@/libs/constants";

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
