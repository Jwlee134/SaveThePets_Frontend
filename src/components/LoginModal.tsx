import { Modal } from "antd";
import LoginButton from "./LoginButton";

interface LoginModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
}

export default function LoginModal({
  isModalOpen,
  handleCancel,
}: LoginModalProps) {
  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      title="로그인이 필요한 서비스입니다."
      footer={[<LoginButton key={0} full />]}
      width={300}
      centered
    />
  );
}
