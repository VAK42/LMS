import { X } from 'lucide-react';
import { createContext, useContext, useState, ReactNode } from 'react';
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('UseToast Must Be Used Within ToastProvider');
  return context;
};
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
          >
            <p className="flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}