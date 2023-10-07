import ReportForm from "@/components/ReportForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "댓글 신고",
};

export default function Page() {
  return <ReportForm />;
}
