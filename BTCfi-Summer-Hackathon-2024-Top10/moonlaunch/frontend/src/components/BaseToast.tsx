import { Toaster } from "sonner";
import {
  Info,
  XCircle,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";

const BaseToast = () => {
  return (
    <>
      <Toaster
        theme="dark"
        position="top-center"
        className="toast-block"
        icons={{
          info: <Info size={16} weight="fill" color="#eba267" />,
          error: <XCircle size={16} weight="fill" color="#ff5c5c" />,
          success: <CheckCircle size={18} weight="fill" color="#16f19d" />,
          warning: <WarningCircle size={16} weight="fill" color="#eba267" />,
        }}
      />
    </>
  );
};

export default BaseToast;
