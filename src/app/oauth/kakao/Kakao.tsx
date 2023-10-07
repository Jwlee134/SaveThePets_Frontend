"use client";

import Spinner from "@/components/Spinner";
import { getJwtToken } from "@/libs/api";
import usePersistStore from "@/libs/store/usePersistStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Kakao() {
  const code = useSearchParams().get("code") || "";
  const router = useRouter();
  const setAuth = usePersistStore((state) => state.setAuth);
  const { mutate } = useMutation({
    mutationFn: (code: string) => getJwtToken(code),
    useErrorBoundary: true,
    onSuccess({ token }) {
      setAuth({ isLoggedIn: true, token });
      router.replace("/");
    },
  });

  useEffect(() => {
    if (!code) router.replace("/");
    mutate(code);
  }, [code, router, mutate]);

  return (
    <div className="h-[var(--fit-screen)] grid place-items-center">
      <div>
        <Spinner size="lg" />
        <div className="text-center text-sm mt-4">
          로그인 중입니다.
          <br />
          페이지를 떠나지 마세요.
        </div>
      </div>
    </div>
  );
}
