import { motion } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FileObj } from "./page";

interface PhotoProps {
  file: FileObj;
  onDeleteClick: (file: FileObj) => void;
}

export default function Photo({ file, onDeleteClick }: PhotoProps) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="border flex-shrink-0 relative w-32 h-32 overflow-hidden rounded-md"
    >
      <Image src={file.url} alt="thumbnail" fill className="object-cover" />
      <button
        onClick={() => {
          onDeleteClick(file);
        }}
        className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
      >
        <IoClose className="text-gray-300 text-lg" />
      </button>
    </motion.div>
  );
}
