import LoginButton from "./LoginButton";

export default function LoginRequired() {
  return (
    <div className="h-[var(--fit-screen)] flex flex-col items-center justify-center">
      <p className="text-sm mb-5">로그인이 필요한 서비스입니다.</p>
      <LoginButton />
    </div>
  );
}
