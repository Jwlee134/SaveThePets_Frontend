import usePersistStore from "@/libs/store/usePersistStore";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function LoginRequired() {
  const setAuth = usePersistStore((state) => state.setAuth);

  return (
    <div className="h-[var(--fit-screen)] flex flex-col items-center justify-center">
      <p className="text-sm mb-5">로그인이 필요한 서비스입니다.</p>
      <button
        onClick={() => setAuth({ isLoggedIn: true, token: "hello" })}
        className="bg-[#ffe812] flex items-center justify-center rounded-md border-transparent px-4 py-1 h-8 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe812] focus:outline-none transition"
      >
        <RiKakaoTalkFill className="mr-2" />
        카카오톡으로 시작하기
      </button>
    </div>
  );
}
