import usePersistStore from "@/libs/store/usePersistStore";
import { cls } from "@/libs/utils";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function LoginButton({ full = false }: { full?: boolean }) {
  const setAuth = usePersistStore((state) => state.setAuth);

  return (
    <button
      onClick={() => setAuth({ isLoggedIn: true, token: "hello" })}
      className={cls(
        "bg-[#ffe812] mx-auto flex items-center justify-center rounded-md border-transparent px-4 py-1 h-8 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#ffe812] focus:outline-none transition",
        full ? "w-full" : ""
      )}
    >
      <RiKakaoTalkFill className="mr-2" />
      카카오톡으로 시작하기
    </button>
  );
}
