import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { IoAddOutline } from "react-icons/io5";
import Photo from "./Photo";
import { AnimatePresence, motion } from "framer-motion";
import { message } from "antd";
import { getBase64 } from "@/libs/utils";
import { FileObj } from "./page";

interface PhotosProps {
  fileList: FileObj[];
  setFileList: Dispatch<SetStateAction<FileObj[]>>;
}

export default function Photos({ fileList, setFileList }: PhotosProps) {
  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    if (fileList.length + e.target.files.length > 10) {
      message.warning("최대 10장까지 추가할 수 있습니다.");
      return;
    }
    const newFileList = await Promise.all(
      Array.from(e.target.files!).map(async (file) => {
        const thumbUrl = await getBase64(file);
        return { data: file, id: `${file.name}-${file.size}`, url: thumbUrl };
      })
    );
    setFileList([...fileList, ...newFileList]);
  }

  function onDeleteClick(file: FileObj) {
    setFileList(fileList.filter((item) => item.id !== file.id));
  }

  return (
    <div className="flex overflow-x-auto space-x-3 min-w-full">
      <AnimatePresence>
        {fileList.map((file) => (
          <Photo file={file} onDeleteClick={onDeleteClick} key={file.id} />
        ))}
        <motion.label
          layout
          htmlFor="file"
          className="transition-colors flex-shrink-0 w-32 h-32 rounded-md border-dashed bg-gray-100 border-gray-400 border flex flex-col items-center justify-center hover:border-[#1677ff]"
        >
          <IoAddOutline className="text-lg mb-2" />
          사진 선택
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            multiple
            className="input-file"
          />
        </motion.label>
      </AnimatePresence>
    </div>
  );
}
