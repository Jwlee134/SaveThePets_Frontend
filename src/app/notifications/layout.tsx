import Header from "@/components/Header";
import NotificationHeaderIcon from "@/app/notifications/NotificationHeaderIcon";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="알림" rightIcons={[<NotificationHeaderIcon key={1} />]} />
      <div className="p-4">{children}</div>
    </>
  );
}
