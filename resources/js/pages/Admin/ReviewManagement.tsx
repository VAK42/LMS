import { Trash2, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Plus, Edit } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Review {
  reviewId: number;
  user: { userId: number; userName: string };
  course: { courseId: number; courseTitle: string };
  rating: number;
  reviewText: string | null;
  createdAt: string;
}
interface Props {
  reviews: {
    data: Review[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    rating?: string;
  };
  users: Array<{ userId: number; userName: string }>;
  courses: Array<{ courseId: number; courseTitle: string }>;
  user: any;
}
export default function ReviewManagement({ reviews, filters, users, courses, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const handleSearch = () => {
    const params: { search?: string; rating?: string } = {};
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (ratingFilter && ratingFilter.trim()) params.rating = ratingFilter;
    router.get('/admin/reviews', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (ratingFilter && ratingFilter.trim()) params.rating = ratingFilter;
    return params;
  };
  const handleDelete = (reviewId: number) => {
    if (confirm(t('deleteReviewConfirm'))) {
      router.post(`/admin/reviews/${reviewId}`, { _method: 'DELETE' }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('reviewDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('reviewDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/reviews', data, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('reviewCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('reviewCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedReview) return;
    router.post(`/admin/reviews/${selectedReview.reviewId}`, { ...data, _method: 'PUT' }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('reviewUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedReview(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('reviewUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const openEditModal = (review: Review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
        ))}
      </div>
    );
  };
  const columns = [
    {
      key: 'user',
      label: t('user'),
      render: (_: any, row: Review) => row.user.userName
    },
    {
      key: 'course',
      label: t('course'),
      render: (_: any, row: Review) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'rating',
      label: t('rating'),
      sortable: true,
      render: (value: number) => renderStars(value)
    },
    {
      key: 'reviewText',
      label: t('review'),
      render: (value: string | null) => (
        <p className="max-w-md truncate text-zinc-600 dark:text-zinc-400">{value || t('noReviewText')}</p>
      )
    },
    {
      key: 'createdAt',
      label: t('date'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Review) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.reviewId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const handleExportAllReviews = async () => {
    try {
      const response = await fetch('/admin/reviews/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allReviews = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allReviews.map((review: any) => exportColumns.map(col => {
        let value = review[col.key];
        if (col.key === 'user') {
          value = review.user?.userName || '';
        } else if (col.key === 'course') {
          value = review.course?.courseTitle || '';
        } else if (col.key === 'createdAt' && value) {
          value = new Date(value).toLocaleDateString();
        } else if (col.key === 'reviewText') {
          value = value || '';
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('reviewsExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('reviewsExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportReviewsFailed'), 'error');
    }
  };
  const formFields = [
    { name: 'userId', label: t('user'), type: 'select' as const, required: true, options: users.map(u => ({ value: u.userId.toString(), label: u.userName })) },
    { name: 'courseId', label: t('course'), type: 'select' as const, required: true, options: courses.map(c => ({ value: c.courseId.toString(), label: c.courseTitle })) },
    { name: 'rating', label: t('rating'), type: 'select' as const, required: true, options: [{ value: '5', label: t('5stars') }, { value: '4', label: t('4stars') }, { value: '3', label: t('3stars') }, { value: '2', label: t('2stars') }, { value: '1', label: t('1star') }] },
    { name: 'reviewText', label: t('reviewText'), type: 'textarea' as const, required: false }
  ];
  return (
    <Layout user={user}>
      <Head title={t('reviewManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/reviews" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('reviewManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageReviewsSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                {t('addReview')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchByCourse')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allRatings')}</option>
                  <option value="5">{t('5stars')}</option>
                  <option value="4">{t('4stars')}</option>
                  <option value="3">{t('3stars')}</option>
                  <option value="2">{t('2stars')}</option>
                  <option value="1">{t('1star')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={reviews.data} exportable={true} keyField="reviewId" onExport={handleExportAllReviews} />
            {reviews.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page - 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {reviews.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {reviews.current_page > 1 && (
                  <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page - 1), { preserveState: true, only: ['reviews'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {reviews.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {reviews.current_page}
                </button>
                {reviews.current_page < reviews.last_page && (
                  <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page + 1), { preserveState: true, only: ['reviews'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {reviews.current_page + 1}
                  </button>
                )}
                {reviews.current_page < reviews.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page + 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.last_page), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewReview')} fields={formFields} submitLabel={t('addReview')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedReview(null); }} onSubmit={handleEdit} title={t('editReview')} fields={formFields} initialData={selectedReview ? { userId: selectedReview.user.userId.toString(), courseId: selectedReview.course.courseId.toString(), rating: selectedReview.rating.toString(), reviewText: selectedReview.reviewText || '' } : {}} submitLabel={t('updateReview')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}