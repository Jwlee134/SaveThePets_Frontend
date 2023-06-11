"use client";

import usePersistStore from "@/libs/store/usePersistStore";
import { Dropdown, MenuProps, Modal } from "antd";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function NewButton() {
  const isLoggedIn = usePersistStore((state) => state.auth.isLoggedIn);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleClick(url: string) {
    if (!isLoggedIn) {
      showModal();
    } else {
      router.push(url);
    }
  }

  const items: MenuProps["items"] = [
    {
      label: "실종",
      key: 0,
      onClick: () => handleClick("/new?type=missed"),
    },
    {
      label: "목격",
      key: 1,
      onClick: () => handleClick("/new?type=witnessed"),
    },
    {
      label: "보호",
      key: 2,
      onClick: () => handleClick("/new?type=saved"),
    },
    {
      label: "분양",
      key: 3,
      onClick: () => handleClick("/new?type=distributed"),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <IoAddCircleOutline key={1} className="text-2xl" />
      </Dropdown>
      <LoginModal isModalOpen={isModalOpen} handleCancel={handleCancel} />
    </>
  );
}
