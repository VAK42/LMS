import { X } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import useTranslation from '../../hooks/useTranslation';
interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  fields: Field[];
  initialData?: Record<string, any>;
  submitLabel?: string;
}
export default function ModalForm({ isOpen, onClose, onSubmit, title, fields, initialData = {}, submitLabel }: Props) {
  const { t } = useTranslation();
  const finalSubmitLabel = submitLabel || t('submit');
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, isOpen]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                {field.type !== 'checkbox' && (
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-600">*</span>}
                  </label>
                )}
                {field.type === 'select' ? (
                  <select value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                    <option value="" disabled>{t('select')} {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-4 h-4 text-black dark:text-white border-zinc-300 dark:border-zinc-700 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{field.label}</span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : ''}
                    onChange={(e) => handleChange(field.name, field.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    min={field.min}
                    max={field.max}
                    step={field.type === 'number' && field.name === 'simulatedPrice' ? '0.01' : undefined}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button type="submit" className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
              {finalSubmitLabel}
            </button>
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              {t('cancel')}
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}