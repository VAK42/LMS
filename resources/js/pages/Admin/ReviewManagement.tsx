import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
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
  user: any;
}
export default function ReviewManagement({ reviews, filters, user }: Props) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
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
        onSuccess: () => showToast('Review Deleted Successfully!', 'success'),
        onError: () => showToast('Failed To Delete Review! Please Try Again!', 'error')
      });
    }
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
        <button onClick={() => handleDelete(row.reviewId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Review Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/reviews" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Review Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400">Manage Course Reviews & Ratings</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Course..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
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
            <DataTable columns={columns} data={reviews.data} exportable={true} keyField="reviewId" />
            {reviews.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page - 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{reviews.current_page}</button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.current_page + 1), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/reviews', buildPaginationParams(reviews.last_page), { preserveState: true, only: ['reviews'] })} disabled={reviews.current_page === reviews.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}