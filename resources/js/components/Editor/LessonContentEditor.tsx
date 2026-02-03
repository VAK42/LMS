import { X, Upload, FileText, Video, Loader2, Check } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useState, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';
import useTranslation from '../../hooks/useTranslation';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    lessonId: number;
    lessonTitle: string;
    contentType: string;
    contentData?: {
      html?: string;
      path?: string;
      filename?: string;
    };
  };
  onSaved: (lessonId: number) => void;
}
export default function LessonContentEditor({ isOpen, onClose, lesson, onSaved }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  useEffect(() => {
    if (isOpen && lesson) {
      fetchContent();
      setSelectedFile(null);
      setVideoDuration(null);
    }
  }, [isOpen, lesson?.lessonId]);
  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/instructor/lessons/${lesson.lessonId}/content`, { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (response.ok) {
        const data = await response.json();
        setCurrentContent(data.contentData);
        if (data.contentType === 'text' && data.contentData?.html) {
          setHtmlContent(data.contentData.html);
        }
      }
    } catch (error) {
      console.error('Failed To Fetch Content!');
    } finally {
      setLoading(false);
    }
  };
  const handleSaveText = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/instructor/lessons/${lesson.lessonId}/content`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ htmlContent }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('contentSaveFailed'));
      showToast(t('contentSavedSuccess'), 'success');
      onSaved(lesson.lessonId);
      onClose();
    } catch (error) {
      showToast(t('contentSaveFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file && lesson.contentType === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const durationInMinutes = Math.ceil(video.duration / 60);
        setVideoDuration(durationInMinutes);
      };
      video.src = URL.createObjectURL(file);
    }
  };
  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (lesson.contentType === 'video' && videoDuration) {
        formData.append('durationMinutes', videoDuration.toString());
      }
      const response = await fetch(`/api/instructor/lessons/${lesson.lessonId}/content`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      showToast(t('fileUploadedSuccess'), 'success');
      onSaved(lesson.lessonId);
      onClose();
    } catch (error: any) {
      showToast(error.message || t('fileUploadFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };
  const getAcceptedFormats = () => {
    if (lesson.contentType === 'video') return '.mp4,.webm,.mov';
    if (lesson.contentType === 'pdf') return '.pdf';
    return '*';
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-green-950 dark:border-white">
          <div>
            <h2 className="text-xl font-serif text-green-950 dark:text-white">{t('editLessonContent')}</h2>
            <p className="text-sm text-zinc-500">{lesson.lessonTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-950 dark:text-white" />
            </div>
          ) : lesson.contentType === 'text' ? (
            <div className="space-y-4">
              <label className="block text-sm text-green-950 dark:text-white">{t('lessonContent')}</label>
              <TiptapEditor content={htmlContent} onChange={setHtmlContent} />
            </div>
          ) : (
            <div className="space-y-4">
              {currentContent?.path && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-950 dark:border-white rounded p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-950 dark:text-white" />
                    <div>
                      <p className="font-medium text-green-950 dark:text-white">{t('currentFile')}</p>
                      <p className="text-sm text-green-700 dark:text-green-400">{currentContent.filename}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-2 border-dashed border-green-950 dark:border-white rounded p-8 text-center">
                {lesson.contentType === 'video' ? (
                  <Video className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                ) : (
                  <FileText className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                )}
                <p className="text-lg font-medium text-green-950 dark:text-white mb-2">
                  {selectedFile ? selectedFile.name : t('uploadVideoOrPdf')}
                </p>
                <p className="text-sm text-zinc-500 mb-2">
                  {lesson.contentType === 'video' ? t('supportedFormatsVideo') : t('supportedFormatsPdf')}
                </p>
                {lesson.contentType === 'video' && videoDuration && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-4">{t('videoLength', { duration: videoDuration })}</p>
                )}
                <input
                  type="file"
                  accept={getAcceptedFormats()}
                  onChange={e => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-green-950 dark:border-white text-green-950 dark:text-white rounded hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {t('chooseFile')}
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 p-6 border-t border-green-950 dark:border-white">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-green-950 dark:border-white text-green-950 dark:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">{t('cancel')}</button>
          {lesson.contentType === 'text' ? (
            <button onClick={handleSaveText} disabled={saving || !htmlContent.trim()} className="flex-1 px-4 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 border border-green-950 dark:border-white rounded hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 disabled:opacity-50 cursor-pointer transition-colors">
              {saving ? t('saving') : t('saveContent')}
            </button>
          ) : (
            <button onClick={handleUploadFile} disabled={saving || !selectedFile} className="flex-1 px-4 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 border border-green-950 dark:border-white rounded hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 disabled:opacity-50 cursor-pointer transition-colors">
              {saving ? t('uploading') : t('uploadFile')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}