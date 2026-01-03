import { Search, Users, Star, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
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
    current_page: number;
    last_page: number;
  };
  categories: Array<{ categoryId: number; categoryName: string }>;
  filters?: {
    search?: string;
    category?: string;
  };
  user?: any;
}
export default function CourseCatalog({ courses, categories, filters, user }: CourseCatalogProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
  const handleSearch = () => {
    router.get('/courses', {
      search,
      category: selectedCategory,
    }, {
      preserveState: true,
    });
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string; category?: string } = { page };
    if (search && search.trim()) {
      params.search = search;
    }
    if (selectedCategory && selectedCategory.trim()) {
      params.category = selectedCategory;
    }
    return params;
  };
  return (
    <Layout user={user}>
      <Head title="Browse Courses" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Discover Your Next Learning Adventure From Our Extensive Catalog
          </p>
        </div>
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search Courses..."
                className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
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
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No Courses Found! Try Adjusting Your Filters!
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
                <div className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-colors">
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                    {course.courseImage ? (
                      <img src={course.courseImage} alt={course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm text-black dark:text-white font-medium mb-2">
                        {course.category.categoryName}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-black dark:text-white group-hover:underline transition-colors line-clamp-2">
                        {course.courseTitle}
                      </h3>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {course.courseDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.totalEnrollments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />
                        {(typeof course.averageRating === 'number' ? course.averageRating : parseFloat(course.averageRating || '0')).toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        By {course.instructor.userName}
                      </div>
                      <div className="text-xl font-serif font-bold text-black dark:text-white">
                        {!course.simulatedPrice || course.simulatedPrice <= 0 ? 'Free' : `$${course.simulatedPrice}`}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {courses.last_page > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => router.get('/courses', buildPaginationParams(1))}
              disabled={courses.current_page === 1}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.get('/courses', buildPaginationParams(courses.current_page - 1))}
              disabled={courses.current_page === 1}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {courses.current_page > 2 && (
              <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
            )}
            {courses.current_page > 1 && (
              <button
                onClick={() => router.get('/courses', buildPaginationParams(courses.current_page - 1))}
                className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer"
              >
                {courses.current_page - 1}
              </button>
            )}
            <button
              className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white cursor-pointer"
            >
              {courses.current_page}
            </button>
            {courses.current_page < courses.last_page && (
              <button
                onClick={() => router.get('/courses', buildPaginationParams(courses.current_page + 1))}
                className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer"
              >
                {courses.current_page + 1}
              </button>
            )}
            {courses.current_page < courses.last_page - 1 && (
              <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
            )}
            <button
              onClick={() => router.get('/courses', buildPaginationParams(courses.current_page + 1))}
              disabled={courses.current_page === courses.last_page}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.get('/courses', buildPaginationParams(courses.last_page))}
              disabled={courses.current_page === courses.last_page}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}