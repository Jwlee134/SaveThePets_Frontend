"use client";

import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { IoAddCircleOutline } from "react-icons/io5";

const items: MenuProps["items"] = [
  {
    label: <Link href="/new?type=missed">실종</Link>,
    key: 0,
  },
  {
    label: <Link href="/new?type=witnessed">목격</Link>,
    key: 1,
  },
  {
    label: <Link href="/new?type=saved">보호</Link>,
    key: 2,
  },
  {
    label: <Link href="/new?type=distributed">분양</Link>,
    key: 3,
  },
];

export default function NewButton() {
  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <IoAddCircleOutline key={1} className="text-2xl" />
    </Dropdown>
  );
}
