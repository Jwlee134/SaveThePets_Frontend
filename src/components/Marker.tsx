import Image from "next/image";
import Spinner from "./Spinner";
import { AnimatePresence, motion } from "framer-motion";

interface MarkerProps {
  url: string;
  isLoading: boolean;
}

export default function Marker({ url, isLoading }: MarkerProps) {
  return (
    <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-lg">
      <Image
        src={url}
        alt="thumbnail"
        fill
        className="border-white border-4 object-cover rounded-full"
      />
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bg-black bg-opacity-30 w-full h-full grid place-items-center"
          >
            <Spinner />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
