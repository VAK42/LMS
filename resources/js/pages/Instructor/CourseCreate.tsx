import { useToast } from '../../contexts/ToastContext';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Category {
  categoryId: number;
  categoryName: string;
}
interface Props {
  categories: Category[];
  user: any;
}
export default function CourseCreate({ categories, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    categoryId: categories[0]?.categoryId || 1,
    simulatedPrice: 0,
    courseMeta: {
      whatYouLearn: [
        t('defaultLearn1'),
        t('defaultLearn2'),
        t('defaultLearn3'),
        t('defaultLearn4'),
      ]
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseTitle.trim()) {
      showToast(t('enterCourseTitleError'), 'error');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToCreateCourse'));
      const data = await response.json();
      showToast(t('courseCreatedSuccess'), 'success');
      router.visit(`/instructor/courses/${data.courseId}/edit`);
    } catch (error) {
      showToast(t('courseCreateFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('createNewCourse')} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instructor/dashboard" className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-green-950 dark:text-white">{t('createNewCourse')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{t('fillInDetails')}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('courseTitleLabel')}</label>
                <input type="text" value={formData.courseTitle} onChange={e => setFormData({ ...formData, courseTitle: e.target.value })} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('enterCourseTitle')} />
              </div>
              <div>
                <label className="block text-sm text-green-950 dark:text-white mb-2">{t('descriptionLabel')}</label>
                <textarea value={formData.courseDescription} onChange={e => setFormData({ ...formData, courseDescription: e.target.value })} rows={4} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('whatWillStudentsLearn')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-green-950 dark:text-white mb-2">{t('categoryLabel')}</label>
                  <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white cursor-pointer">
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-green-950 dark:text-white mb-2">{t('priceLabel')}</label>
                  <input type="number" value={formData.simulatedPrice} onChange={e => setFormData({ ...formData, simulatedPrice: parseFloat(e.target.value) || 0 })} min="0" step="0.01" className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('pricePlaceholder')} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/instructor/dashboard" className="px-6 py-3 rounded border border-green-950 dark:border-white text-green-950 dark:text-white font-medium hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors">{t('cancel')}</Link>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">
              <Save className="w-5 h-5" />
              {saving ? t('creating') : t('createCourse')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}