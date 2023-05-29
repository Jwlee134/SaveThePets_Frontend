import Carousel from "@/components/Carousel";
import { Dropdown } from "antd";
import Link from "next/link";
import {
  IoBookmarkOutline,
  IoChatboxOutline,
  IoMenuOutline,
} from "react-icons/io5";
import Timeline from "./Timeline";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <Carousel />
      <div className="px-6">
        <div className="flex items-center justify-between text-lg py-4">
          <div className="flex items-center space-x-4">
            <button>
              <IoBookmarkOutline />
            </button>
            <Link href={`/posts/${id}/comments`}>
              <IoChatboxOutline />
            </Link>
          </div>
          {/* <Dropdown
            menu={{
              items: [
                {
                  label: <Link href={`/posts/${id}/report`}>신고</Link>,
                  key: "0",
                },
              ],
            }}
          >
            <IoMenuOutline />
          </Dropdown> */}
        </div>
        <p className="break-all font-light">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <Timeline />
      </div>
    </div>
  );
}
