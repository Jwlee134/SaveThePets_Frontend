import Image from "next/image";
import CommentDropdown from "./CommentDropdown";

export default function Comment() {
  const value = `Lorem Ipsum is simply dummy text of the printing and typesetting
  industry. Lorem Ipsum has been the industry's standard dummy text ever
  since the 1500s, when an unknown printer took a galley of type and
  scrambled it to make a type specimen book.`;

  return (
    <>
      <div className="flex">
        <div className="relative overflow-hidden rounded-full w-14 h-14 mr-4 shrink-0">
          <Image
            src="/sample1.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              닉네임 <span className="text-xs text-gray-500">• 며칠 전</span>
            </div>
            <CommentDropdown />
          </div>
          <p className="text-sm font-light mt-2">{value}</p>
        </div>
      </div>
    </>
  );
}
