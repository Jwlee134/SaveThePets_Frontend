import Image from "next/image";
import { ReactNode } from "react";
import BackButton from "./BackButton";

interface IProps {
  showLogo?: boolean;
  showBackBtn?: boolean;
  title?: string;
  rightIcons?: ReactNode[];
}

export default function Header({
  showLogo,
  showBackBtn,
  title,
  rightIcons,
}: IProps) {
  return (
    <header className="h-12 border-b-2 fixed top-0 left-0 right-0 bg-white z-[999]">
      <div className="max-w-screen-sm h-full mx-auto px-4 grid grid-cols-3 items-center">
        <div className="flex items-center">
          {showLogo && (
            <Image
              src="/logo.svg"
              alt="logo"
              width={150}
              height={50}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          )}
          {showBackBtn && <BackButton />}
        </div>
        <div className="grid place-items-center">{title && title}</div>
        <div>
          {rightIcons && (
            <div className="space-x-4 flex justify-end items-center">
              {rightIcons.map((icon) => icon)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
