"use client";

import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Modal,
  Slider,
} from "antd";
import { useState } from "react";
import { IoFilterOutline, IoLocateOutline } from "react-icons/io5";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import useGeolocation from "@/libs/hooks/useGeolocation";
import Spinner from "./Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import usePersistStore from "@/libs/store/usePersistStore";
import { shallow } from "zustand/shallow";

interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}

const checkboxOptions = [
  { label: "실종", value: "0" },
  { label: "목격", value: "1" },
  { label: "보호", value: "2" },
  { label: "분양", value: "3" },
];

const cascaderOptions: CascaderOption[] = [
  {
    value: "0",
    label: "개",
    children: [
      { value: "0", label: "말티즈" },
      { value: "1", label: "치와와" },
    ],
  },
  {
    value: "1",
    label: "고양이",
    children: [
      { value: "0", label: "노르웨이숲" },
      { value: "1", label: "코리안숏헤어" },
    ],
  },
];

function createSearchParams(params: {
  [key: string]: string | string[];
}): URLSearchParams {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach((value) => {
        searchParams.append(key, value);
      });
    } else {
      searchParams.append(key, values);
    }
  });
  return searchParams;
}

export default function FilterButton() {
  const { view, lat, lng } = usePersistStore(
    (state) => ({
      view: state.viewOpts.homeViewOpt,
      lat: state.coords.lat,
      lng: state.coords.lng,
    }),
    shallow
  );
  const [form] = Form.useForm<{
    type: string[];
    speciesBreed: string[];
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    range: number;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coord, setCoord] = useState({
    lat: view === "map" ? lat : parseFloat(searchParams.get("userLat") || "0"),
    lng: view === "map" ? lng : parseFloat(searchParams.get("userLot") || "0"),
  });
  const { isLoading, handleGetCurrentPos } = useGeolocation({
    callback(lat, lng) {
      setCoord({ lat, lng });
    },
  });

  const type = searchParams.getAll("type");
  const rangeParam = searchParams.get("range");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const speciesParam = searchParams.get("species");
  const breedParam = searchParams.get("breed");

  const initialValues = {
    type: !type.length ? ["0", "1", "2", "3"] : type,
    ...(startDateParam && { startDate: dayjs(startDateParam) }),
    ...(endDateParam && { startDate: dayjs(endDateParam) }),
    ...(speciesParam && {
      speciesBreed: [speciesParam, ...(breedParam ? [breedParam] : [])],
    }),
    range: rangeParam ? parseInt(rangeParam) : 0,
  };

  function showModal() {
    setIsModalOpen(true);
  }

  function handleSearch() {
    const { type, startDate, endDate, speciesBreed, range } =
      form.getFieldsValue();
    const values = {
      ...(type.length < 4 && { type }),
      ...(startDate && { startDate: startDate.format("YYYY-MM-DD") }),
      ...(endDate && { endDate: endDate.format("YYYY-MM-DD") }),
      ...(range && { range: range.toString() }),
      ...(coord.lat &&
        coord.lng && {
          userLat: coord.lat.toString(),
          userLot: coord.lng.toString(),
        }),
      ...(speciesBreed && {
        ...(speciesBreed?.[0] && { species: speciesBreed[0] }),
        ...(speciesBreed?.[1] && { breed: speciesBreed[1] }),
      }),
    };
    const queryString = createSearchParams(values).toString();
    // TODO: API 요청
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
        bodyStyle={{ padding: "0 12px" }}
        footer={[
          <Button key={1} onClick={handleReset}>
            초기화
          </Button>,
          <Button key={2} onClick={handleSearch}>
            조회
          </Button>,
        ]}
      >
        <Form form={form} initialValues={initialValues}>
          <Form.Item name="type" label="게시글 종류">
            <Checkbox.Group
              options={checkboxOptions}
              onChange={(v) => {
                if (!v.length) form.setFieldValue("type", ["0", "1", "2", "3"]);
              }}
            />
          </Form.Item>
          <Form.Item name="speciesBreed" label="종 및 품종">
            <Cascader options={cascaderOptions} changeOnSelect />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              className="flex-grow"
              name="range"
              label={
                <div>
                  범위
                  {!coord.lat && !coord.lng && view === "grid" && (
                    <span className="text-xs text-[#ff4d4f]">
                      {" "}
                      (현재 위치가 필요합니다.)
                    </span>
                  )}
                </div>
              }
            >
              <Slider
                min={0}
                max={100}
                className="flex-grow"
                tooltip={{ formatter: (v) => `${v}km` }}
                disabled={!coord.lat && !coord.lng && view === "grid"}
              />
            </Form.Item>
            <Button
              className="ml-4 w-[52px] self-end mb-6"
              onClick={handleGetCurrentPos}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <IoLocateOutline className="text-xl" />
              )}
            </Button>
          </div>
          <Form.Item label="날짜" className="mb-0">
            <Form.Item name="startDate" className="inline-block w-full">
              <DatePicker
                disabledDate={(date) => {
                  return endDate && date > dayjs(endDate).add(-1, "day");
                }}
                className="w-full"
                locale={locale}
                inputReadOnly
              />
            </Form.Item>
            <span className="inline-block text-center leading-9">-</span>
            <Form.Item name="endDate" className="inline-block w-full">
              <DatePicker
                disabledDate={(date) => {
                  return startDate && date < dayjs(startDate).add(1, "day");
                }}
                className="w-full"
                locale={locale}
                inputReadOnly
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
