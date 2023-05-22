import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={router.back}>
      <IoChevronBack className="text-xl text-gray-500" />
    </button>
  );
}
