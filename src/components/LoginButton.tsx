import { cls } from "@/libs/utils";
import Link from "next/link";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function LoginButton({ full = false }: { full?: boolean }) {
  return (
    <Link
      href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`}
      className={cls(
        "bg-[#ffe812] mx-auto flex items-center justify-center rounded-md border-transparent px-4 py-1 h-8 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe812] focus:outline-none transition",
        full ? "w-full" : ""
      )}
    >
      <RiKakaoTalkFill className="mr-2" />
      카카오톡으로 시작하기
    </Link>
  );
}
