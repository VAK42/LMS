import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
interface Props {
  children: React.ReactNode;
  onClear?: () => void;
}
export default function FilterPanel({ children, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Filters
        </button>
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}
