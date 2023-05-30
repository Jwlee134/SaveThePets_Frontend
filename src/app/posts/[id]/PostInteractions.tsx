import Link from "next/link";
import { useParams } from "next/navigation";
import { IoBookmarkOutline, IoChatboxOutline } from "react-icons/io5";
import AddToTimelineButton from "./AddToTimelineButton";

export default function PostInteractions() {
  const params = useParams();

  return (
    <>
      <div className="flex items-center space-x-4">
        <button>
          <IoBookmarkOutline />
        </button>
        <Link href={`/posts/${params.id}/comments`}>
          <IoChatboxOutline />
        </Link>
        <AddToTimelineButton />
      </div>
    </>
  );
}
