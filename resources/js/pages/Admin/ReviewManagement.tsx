import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Plus, Edit } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
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
    if (confirm('Are You Sure You Want To Delete This Review?')) {
      router.post(`/admin/reviews/${reviewId}`, { _method: 'DELETE' }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || 'Review Deleted Successfully!';
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || 'Failed To Delete Review!';
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/reviews', data, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || 'Review Created Successfully!';
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || 'Failed To Create Review!';
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedReview) return;
    router.post(`/admin/reviews/${selectedReview.reviewId}`, { ...data, _method: 'PUT' }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || 'Review Updated Successfully!';
        setIsEditModalOpen(false);
        setSelectedReview(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || 'Failed To Update Review!';
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
      label: 'User',
      render: (_: any, row: Review) => row.user.userName
    },
    {
      key: 'course',
      label: 'Course',
      render: (_: any, row: Review) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value: number) => renderStars(value)
    },
    {
      key: 'reviewText',
      label: 'Review',
      render: (value: string | null) => (
        <p className="max-w-md truncate text-zinc-600 dark:text-zinc-400">{value || 'No Review Text'}</p>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
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
      const response = await fetch('/admin/reviews/export');
      if (!response.ok) throw new Error('Export Failed');
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
      link.download = 'Reviews.csv';
      link.click();
      URL.revokeObjectURL(url);
      showToast('Reviews Exported Successfully!', 'success');
    } catch (error) {
      showToast('Failed To Export Reviews!', 'error');
    }
  };
  const formFields = [
    { name: 'userId', label: 'User', type: 'select' as const, required: true, options: users.map(u => ({ value: u.userId.toString(), label: u.userName })) },
    { name: 'courseId', label: 'Course', type: 'select' as const, required: true, options: courses.map(c => ({ value: c.courseId.toString(), label: c.courseTitle })) },
    { name: 'rating', label: 'Rating', type: 'select' as const, required: true, options: [{ value: '5', label: '5 Stars' }, { value: '4', label: '4 Stars' }, { value: '3', label: '3 Stars' }, { value: '2', label: '2 Stars' }, { value: '1', label: '1 Star' }] },
    { name: 'reviewText', label: 'Review Text', type: 'textarea' as const, required: false }
  ];
  return (
    <Layout user={user}>
      <Head title="Review Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/reviews" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Review Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage Course Reviews & Ratings</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                Add Review
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Course..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={reviews.data} exportable={true} keyField="reviewId" onExport={handleExportAllReviews} />
            {reviews.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page - 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
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
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page + 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.last_page), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create New Review" fields={formFields} submitLabel="Create Review" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedReview(null); }} onSubmit={handleEdit} title="Edit Review" fields={formFields} initialData={selectedReview ? { userId: selectedReview.user.userId.toString(), courseId: selectedReview.course.courseId.toString(), rating: selectedReview.rating.toString(), reviewText: selectedReview.reviewText || '' } : {}} submitLabel="Update Review" />
          </div>
        </div>
      </div>
    </Layout>
  )
}