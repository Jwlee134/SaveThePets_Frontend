"use client";

import { Modal } from "antd";
import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { createSearchParams } from "@/libs/utils";
import FilterForm, { FilterSubmitData } from "./FilterForm";

export default function FilterButton() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal() {
    setShowForm(true);
    setIsModalOpen(true);
  }

  function handleSearch({
    type,
    startDate,
    endDate,
    range,
    speciesBreed,
    coord,
    view,
  }: FilterSubmitData) {
    const values = {
      ...(type.length < 4 && { type }),
      ...(startDate && { startDate: startDate.format("YYYY-MM-DD") }),
      ...(endDate && { endDate: endDate.format("YYYY-MM-DD") }),
      ...(range &&
      (view === "map" || (view === "grid" && coord.lat && coord.lng))
        ? { range: range.toString() }
        : {}), // 그리드 뷰인데 현재 위치 좌표 없으면 range 제거
      ...(coord.lat &&
        coord.lng && {
          userLat: coord.lat.toString(),
          userLot: coord.lng.toString(),
        }),
      ...(speciesBreed && {
        species: speciesBreed[0],
        ...(speciesBreed?.[1] !== undefined && { breed: speciesBreed[1] }),
      }),
    };
    const queryString = createSearchParams(values).toString();
    // TODO: API 요청, int type은 없으면 -1 줘야함
    router.replace(`/?${queryString}`);
    setIsModalOpen(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleReset() {
    router.replace("/");
    setIsModalOpen(false);
  }

  return (
    <>
      <button onClick={showModal}>
        <IoFilterOutline className="text-2xl" />
      </button>
      <Modal
        title="필터"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        afterClose={() => setShowForm(false)}
        footer={[]}
      >
        {showForm && (
          <FilterForm handleReset={handleReset} handleSearch={handleSearch} />
        )}
      </Modal>
    </>
  );
}
