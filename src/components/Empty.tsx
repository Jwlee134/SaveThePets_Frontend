import { Empty as AntdEmpty } from "antd";

export default function Empty() {
  return (
    <div className="h-[var(--fit-screen)] grid place-items-center">
      <AntdEmpty />
    </div>
  );
}
