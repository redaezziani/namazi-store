// This is a simple toast notification system
import { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  title?: string;
  description?: string;
  duration?: number;
  type?: 'default' | 'success' | 'error' | 'warning';
}

const ToastContext = createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function toast(props: ToastProps) {
  const toastFn = useContext(ToastContext).toast;
  toastFn(props);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const addToast = (props: ToastProps) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...props, id }]);

    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, props.duration || 3000);
    }
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
              {toasts.map((toast) => (
                <ToastItem
                  key={toast.id}
                  {...toast}
                  onClose={() => removeToast(toast.id)}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

function ToastItem({
  id,
  title,
  description,
  type = 'default',
  onClose,
}: ToastProps & { id: number; onClose: () => void }) {
  const bgColor = {
    default: 'bg-white',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-lg border shadow-md ${bgColor} p-4 min-w-[300px] max-w-[400px]`}
    >
      <div className="flex justify-between items-start">
        {title && <h3 className="font-medium">{title}</h3>}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </motion.div>
  );
}
