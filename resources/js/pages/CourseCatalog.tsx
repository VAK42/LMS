import { Head, Link, router } from '@inertiajs/react';
import { Search, Users, Star } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  simulatedPrice: number;
  courseImage: string | null;
  isPublished: boolean;
  averageRating: number;
  totalEnrollments: number;
  instructor: {
    userId: number;
    userName: string;
  };
  category: {
    categoryId: number;
    categoryName: string;
  };
}
interface CourseCatalogProps {
  courses: {
    data: Course[];
    currentPage: number;
    lastPage: number;
  };
  categories: Array<{ categoryId: number; categoryName: string }>;
  user?: any;
}
export default function CourseCatalog({ courses, categories, user }: CourseCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const handleSearch = () => {
    router.get('/courses', {
      search,
      category: selectedCategory,
    }, {
      preserveState: true,
    });
  };
  return (
    <Layout user={user}>
      <Head title="Browse Courses" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover Your Next Learning Adventure From Our Extensive Catalog
          </p>
        </div>
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search Courses..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Search
            </button>
          </div>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No Courses Found. Try Adjusting Your Filters!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.data.map((course) => (
              <Link
                key={course.courseId}
                href={`/courses/${course.courseId}`}
                className="group block"
              >
                <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
                    {course.courseImage ? (
                      <img src={course.courseImage} alt={course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
                        {course.courseTitle[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                        {course.category.categoryName}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {course.courseTitle}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {course.courseDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.totalEnrollments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {(typeof course.averageRating === 'number' ? course.averageRating : parseFloat(course.averageRating || '0')).toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        By {course.instructor.userName}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${course.simulatedPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {courses.lastPage > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: courses.lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => router.get(`/courses?page=${page}`)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${page === courses.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}