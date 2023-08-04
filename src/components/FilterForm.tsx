import { Button, Cascader, Checkbox, DatePicker, Form, Slider } from "antd";
import Spinner from "./Spinner";
import { IoLocateOutline } from "react-icons/io5";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/ko_KR";
import useGeolocation from "@/libs/hooks/useGeolocation";
import { useState } from "react";
import usePersistStore, { HomeViewOpt } from "@/libs/store/usePersistStore";
import { shallow } from "zustand/shallow";
import { useSearchParams } from "next/navigation";
import { speciesBreedsOption } from "@/libs/constants";

const checkboxOptions = [
  { label: "실종", value: "0" },
  { label: "목격", value: "1" },
  { label: "보호", value: "2" },
  { label: "분양", value: "3" },
];

export interface FilterData {
  type: string[];
  speciesBreed: string[];
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  range: number;
}

export type FilterSubmitData = FilterData & {
  coord: {
    lat: number;
    lng: number;
  };
  view: HomeViewOpt;
};

interface FilterFormProps {
  handleReset: () => void;
  handleSearch: (data: FilterSubmitData) => void;
}

export default function FilterForm({
  handleReset,
  handleSearch,
}: FilterFormProps) {
  const [form] = Form.useForm<FilterData>();
  const { view, lat, lng } = usePersistStore(
    (state) => ({
      view: state.viewOpts.homeViewOpt,
      lat: state.coords.lat,
      lng: state.coords.lng,
    }),
    shallow
  );
  const searchParams = useSearchParams();

  /* 
  이전에 그리드 뷰였다면 범위가 설정될 경우 기준은 현재 위치를 기준으로 한다.
  지도 뷰였다면 지도를 움직일 때마다 지도의 센터를 기준으로 범위를 설정한다.
  */
  const [coord, setCoord] = useState({
    lat: view === "map" ? lat : parseFloat(searchParams.get("userLat") || "0"),
    lng: view === "map" ? lng : parseFloat(searchParams.get("userLot") || "0"),
  });
  const { isLoading, handleGetCurrentPos } = useGeolocation({
    callback(lat, lng) {
      setCoord({ lat, lng });
    },
  });

  // startDate, endDate picker에서 범위 지정용
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);

  // initialValue 설정용
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
    range: rangeParam ? parseInt(rangeParam) : 20,
  };

  function handleResetClick() {
    form.resetFields();
    handleReset();
  }

  function handleSubmit() {
    handleSearch({ ...form.getFieldsValue(), coord, view });
  }

  return (
    <Form form={form} initialValues={initialValues} className="relative">
      <Form.Item name="type" label="게시글 종류">
        <Checkbox.Group
          options={checkboxOptions}
          onChange={(v) => {
            if (!v.length) form.setFieldValue("type", ["0", "1", "2", "3"]);
          }}
        />
      </Form.Item>
      <Form.Item name="speciesBreed" label="종 및 품종">
        <Cascader options={speciesBreedsOption} changeOnSelect />
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
      <div className="flex justify-end space-x-2 mt-3 -mb-3">
        <Button onClick={handleResetClick}>초기화</Button>
        <Button onClick={handleSubmit}>조회</Button>
      </div>
    </Form>
  );
}
