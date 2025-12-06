import { PackageOpen } from 'lucide-react';
import { ReactNode } from 'react';
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}
export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-10 h-10 text-slate-400" />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}