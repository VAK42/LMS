import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
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
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    categoryId: categories[0]?.categoryId || 1,
    simulatedPrice: 0,
    courseMeta: {
      whatYouLearn: [
        'Master Core Concepts & Practical Applications',
        'Build Real-World Projects From Scratch',
        'Develop Professional Skills For Career Growth',
        'Get Hands-On Experience With Industry Tools',
      ]
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseTitle.trim()) {
      showToast('Please Enter A Course Title!', 'error');
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
      if (!response.ok) throw new Error('Failed To Create Course!');
      const data = await response.json();
      showToast('Course Created Successfully!', 'success');
      router.visit(`/instructor/courses/${data.courseId}/edit`);
    } catch (error) {
      showToast('Failed To Create Course!', 'error');
    } finally {
      setSaving(false);
    }
  };
  return (
    <Layout user={user}>
      <Head title="Create New Course" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instructor/dashboard" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Create New Course</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Fill In The Details To Get Started</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Course Title *</label>
                <input type="text" value={formData.courseTitle} onChange={e => setFormData({ ...formData, courseTitle: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Course Title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                <textarea value={formData.courseDescription} onChange={e => setFormData({ ...formData, courseDescription: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What Will Students Learn..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                  <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Price ($)</label>
                  <input type="number" value={formData.simulatedPrice} onChange={e => setFormData({ ...formData, simulatedPrice: parseFloat(e.target.value) || 0 })} min="0" step="0.01" className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/instructor/dashboard" className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</Link>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 text-green-600 border border-green-600 font-semibold rounded-xl hover:bg-green-900 hover:text-white disabled:opacity-50 cursor-pointer">
              <Save className="w-5 h-5" />
              {saving ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}