import Header from "@/components/Header";
import NewButton from "@/components/NewButton";
import { IoFilterOutline } from "react-icons/io5";
import dynamic from "next/dynamic";

/* 
  https://nextjs.org/docs/getting-started/react-essentials#client-components

  Next.js는 use client를 명시하더라도 서버에서 pre-rendered되며 클라이언트로 hydrate된다.
  따라서 localStorage의 값에 의존하여 컴포넌트를 렌더링하는 Main 컴포넌트 같은 경우
  아예 ssr을 비활성회시키고 렌더링해야 한다. HomeViewToggleButton도 마찬가지.

  ssr을 활성화시키면 localStorage의 값에 따라 서버와 클라이언트의 UI가 달라지게 되어 hydration이 실패한다.
*/
const Main = dynamic(() => import("./Main"), { ssr: false });
const HomeViewToggleButton = dynamic(
  () => import("../components/HomeViewToggleButton"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Header
        showLogo
        rightIcons={[
          <HomeViewToggleButton key={0} />,
          <NewButton key={1} />,
          <IoFilterOutline key={2} className="text-2xl" />,
        ]}
      />
      <Main />
    </>
  );
}
