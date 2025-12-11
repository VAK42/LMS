import { RefreshCw, Download } from 'lucide-react';
interface Props {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
}
export default function ChartCard({ title, children, onRefresh, onExport }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              title="Export Chart"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}