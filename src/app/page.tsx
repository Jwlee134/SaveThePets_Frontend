import Header from "@/components/Header";
import { getPosts } from "@/libs/api/test";
import WithHydration from "@/libs/api/WithHydration";
import NewButton from "@/components/NewButton";
import { IoFilterOutline } from "react-icons/io5";
import Home from "./Home";
import HomeViewToggleButton from "@/components/HomeViewToggleButton";

/* 
  https://nextjs.org/docs/getting-started/react-essentials#client-components

  Next.js는 use client를 명시하더라도 서버에서 pre-rendered되며 클라이언트로 hydrate된다.
  따라서 localStorage의 값에 의존하여 컴포넌트를 렌더링하는 Home 컴포넌트 같은 경우
  아예 ssr을 비활성회시키고 렌더링해야 한다. HomeViewToggleButton도 마찬가지.

  ssr을 활성화시키면 localStorage의 값에 따라 서버와 클라이언트의 UI가 달라지게 되어 hydration이 실패한다.

  대안으로 useLayoutEffect에서 isReady를 true로 바꾸고 true가 되면 컴포넌트들을 렌더링한다.
*/

export default WithHydration(
  <>
    <Header
      showLogo
      rightIcons={[
        <HomeViewToggleButton key={0} />,
        <NewButton key={1} />,
        <IoFilterOutline key={2} className="text-2xl" />,
      ]}
    />
    <Home />
  </>,
  {
    queryKey: ["post"],
    fetchFn: getPosts,
  }
);
