import { CheckSquare, XSquare, Edit, Trash2 } from 'lucide-react';
interface Props {
  selectedCount: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
export default function BulkActionToolbar({ selectedCount, onActivate, onDeactivate, onEdit, onDelete }: Props) {
  if (selectedCount === 0) return null;
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {selectedCount} Item{selectedCount > 1 ? 's' : ''} Selected
        </span>
        <div className="flex items-center gap-2">
          {onActivate && (
            <button
              onClick={onActivate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
            >
              <CheckSquare className="w-4 h-4" />
              Activate
            </button>
          )}
          {onDeactivate && (
            <button
              onClick={onDeactivate}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700"
            >
              <XSquare className="w-4 h-4" />
              Deactivate
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}