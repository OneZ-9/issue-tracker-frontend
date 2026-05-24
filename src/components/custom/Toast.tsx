import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
type ToastType = "success" | "error" | "warning" | "info";
interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}
interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
}
const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});
export function useToast() {
  return useContext(ToastContext);
}
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);
  const iconMap = {
    success: <CheckCircleIcon className="h-5 w-5 text-emerald-500" />,
    error: <XCircleIcon className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangleIcon className="h-5 w-5 text-amber-500" />,
    info: <InfoIcon className="h-5 w-5 text-blue-500" />,
  };
  const borderMap = {
    success: "border-l-emerald-500",
    error: "border-l-red-500",
    warning: "border-l-amber-500",
    info: "border-l-blue-500",
  };
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border-l-4 p-4 ${borderMap[toast.type]} max-w-sm bg-white shadow-md ${exiting ? "toast-exit" : "toast-enter"}`}
      role="alert"
    >
      <div className="mt-0.5 flex-shrink-0">{iconMap[toast.type]}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-xs text-gray-500">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Dismiss notification"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          message,
        },
      ]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
