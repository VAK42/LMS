import { Upload, Image as ImageIcon } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useDropzone } from 'react-dropzone';
import useTranslation from '../hooks/useTranslation';
interface ImageUploadProps {
  currentImage?: string | File | null;
  onImageSelected: (file: File) => void;
  label?: string;
  className?: string;
}
export default function ImageUpload({ currentImage, onImageSelected, label, className = "" }: ImageUploadProps) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const finalLabel = label || t('uploadImage');
  const [preview, setPreview] = useState<string | null>(() => {
    if (currentImage instanceof File) {
      return URL.createObjectURL(currentImage);
    }
    return currentImage ? `/storage/${currentImage}` : null;
  });
  useEffect(() => {
    if (currentImage instanceof File) {
      setPreview(URL.createObjectURL(currentImage));
    } else {
      setPreview(currentImage ? `/storage/${currentImage}` : null);
    }
  }, [currentImage]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast(t('imageSizeError'), "error");
        return;
      }
      onImageSelected(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, [onImageSelected, showToast]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });
  return (
    <div className={className}>
      {finalLabel && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{finalLabel}</label>}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'}
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img src={preview} alt={t('preview')} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" /> {t('changeImage')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full inline-block mb-3">
              <ImageIcon className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
              {t('clickOrDragImage')}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('imageFormats')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}