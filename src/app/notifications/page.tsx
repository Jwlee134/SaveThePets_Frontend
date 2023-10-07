import { Metadata } from "next";
import Notifications from "./Notifications";

export const metadata: Metadata = {
  title: "알림",
};

export default function Page() {
  return <Notifications />;
}
