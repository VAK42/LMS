import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, ArrowUpDown } from 'lucide-react';
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}
interface Props {
  columns: Column[];
  data: any[];
  exportable?: boolean;
  keyField?: string;
}
export default function DataTable({ columns, data, exportable = true, keyField = 'id' }: Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  const sortedData = sortColumn ? [...data].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : data;
  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row => columns.map(col => {
      const value = row[col.key];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LMS.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {exportable && (
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-end">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              {columns.map((column) => (
                <th key={column.key} onClick={() => column.sortable && handleSort(column.key)} className={`px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700' : ''}`}>
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No Data Available
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row[keyField]} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}