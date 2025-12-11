import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Star } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
  const handleSearch = () => {
    router.get('/admin/reviews', { search: searchTerm, rating: ratingFilter }, { preserveState: true });
  };
  const handleDelete = (reviewId: number) => {
    if (confirm('Are You Sure You Want To Delete This Review?')) {
      router.delete(`/admin/reviews/${reviewId}`);
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
        <button onClick={() => handleDelete(row.reviewId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600">
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
                <button onClick={handleSearch} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Search
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={reviews.data} searchable={false} exportable={true} />
          </div>
        </div>
      </div>
    </Layout>
  )
}