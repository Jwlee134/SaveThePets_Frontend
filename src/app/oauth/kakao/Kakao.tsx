"use client";

import Spinner from "@/components/Spinner";
import { getJwtToken } from "@/libs/api";
import usePersistStore from "@/libs/store/usePersistStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Kakao() {
  const code = useSearchParams().get("code") || "";
  const router = useRouter();
  const setAuth = usePersistStore((state) => state.setAuth);

  useEffect(() => {
    let ignore = false;
    if (!code) router.replace("/");
    if (!ignore)
      getJwtToken(code).then((res) => {
        setAuth({ isLoggedIn: true, token: res.token });
        router.replace("/");
      });
    return () => {
      ignore = true;
    };
  }, [code, router, setAuth]);

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
