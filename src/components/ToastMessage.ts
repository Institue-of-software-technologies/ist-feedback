import { toast } from "react-toastify";

type ToastOptions = {
  position?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
};

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
};

export const showToast = {
  success: (message: string, options: ToastOptions = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options: ToastOptions = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options: ToastOptions = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warn: (message: string, options: ToastOptions = {}) => {
    toast.warn(message, { ...defaultOptions, ...options });
  },
};
