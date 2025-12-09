import { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 min-w-[300px] p-4 bg-white dark:bg-zinc-900 border shadow-lg transition-all duration-300 animate-in slide-in-from-right ${toast.type === 'success' ? 'border-green-500' :
              toast.type === 'error' ? 'border-red-500' :
                'border-zinc-300 dark:border-zinc-700'
              }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />}
            <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast Must Be Used Within ToastProvider');
  }
  return context;
}