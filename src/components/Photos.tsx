import { ChangeEvent } from "react";
import { IoAddOutline } from "react-icons/io5";
import Photo from "./Photo";
import { AnimatePresence, motion } from "framer-motion";
import { Form, message } from "antd";
import { getBase64 } from "@/libs/utils";
import { FileObj, PostFormValues } from "./PostForm";

export default function Photos() {
  const form = Form.useFormInstance<PostFormValues>();
  const fileList = Form.useWatch("photos", form) || [];

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
    form.setFields([
      { name: "photos", errors: [], value: [...fileList, ...newFileList] },
    ]);
  }

  function onDeleteClick(file: FileObj) {
    form.setFieldValue(
      "photos",
      fileList.filter((item) => item.id !== file.id)
    );
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
