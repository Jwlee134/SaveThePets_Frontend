"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHome,
  IoHomeOutline,
  IoNotifications,
  IoNotificationsOutline,
  IoPersonCircle,
  IoPersonCircleOutline,
} from "react-icons/io5";

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="h-12 border-t-2 fixed bottom-0 left-0 right-0 bg-white z-[999]">
      <div className="max-w-screen-sm h-full mx-auto grid grid-cols-3 text-2xl">
        <Link href="/" className="grid place-items-center">
          {pathname === "/" ? <IoHome /> : <IoHomeOutline />}
        </Link>
        <Link href="/notifications" className="grid place-items-center">
          {pathname === "/notifications" ? (
            <IoNotifications />
          ) : (
            <IoNotificationsOutline />
          )}
        </Link>
        <Link href="/me" className="grid place-items-center">
          {pathname.includes("me") ? (
            <IoPersonCircle />
          ) : (
            <IoPersonCircleOutline />
          )}
        </Link>
      </div>
    </nav>
  );
}
