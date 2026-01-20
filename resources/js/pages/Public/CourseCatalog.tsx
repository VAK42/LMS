import { Search, Users, Star, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
  const handleSearch = () => {
    const params: any = {};
    if (search && search.trim()) {
      params.search = search;
    }
    if (selectedCategory && selectedCategory.trim()) {
      params.category = selectedCategory;
    }
    router.get('/courses', params, {
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
      <Head title={t('browseCourses')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-green-950 dark:text-white mb-4">
            {t('exploreCourses')}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t('catalogSubtitle')}
          </p>
        </div>
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchPlaceholder')} className="w-full pl-12 pr-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors cursor-pointer rounded">
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <button onClick={handleSearch} className="px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer rounded">
              {t('searchButton')}
            </button>
          </div>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {t('noCoursesFound')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.data.map((course) => (
              <Link key={course.courseId} href={`/courses/${course.courseId}`} className="group block h-full">
                <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border border-green-950 dark:border-white overflow-hidden transition-colors rounded">
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                    {course.courseImage ? (
                      <img src={`/storage/${course.courseImage}`} alt={course.courseTitle} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <BookOpen className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-green-950 dark:bg-white text-white dark:text-green-950 text-xs font-medium uppercase tracking-wider rounded">
                        {course.category.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif text-green-950 dark:text-white group-hover:underline transition-colors line-clamp-2 mb-2">
                        {course.courseTitle}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm">
                        {course.courseDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.totalEnrollments}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        {(typeof course.averageRating === 'number' ? course.averageRating : parseFloat(course.averageRating || '0')).toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-white mt-auto">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {course.instructor.userName}
                        </span>
                      </div>
                      <div className="text-lg font-serif text-green-950 dark:text-white">
                        {!course.simulatedPrice || course.simulatedPrice <= 0 ? t('free') : <>{t('currencySymbol')}{course.simulatedPrice}</>}
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
            <button onClick={() => router.get('/courses', buildPaginationParams(1))} disabled={courses.current_page === 1} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded" aria-label={t('firstPage')}>
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button onClick={() => router.get('/courses', buildPaginationParams(courses.current_page - 1))} disabled={courses.current_page === 1} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded" aria-label={t('previousPage')}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {courses.current_page > 2 && (
              <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
            )}
            {courses.current_page > 1 && (
              <button onClick={() => router.get('/courses', buildPaginationParams(courses.current_page - 1))} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-green-950 dark:text-white border-green-950 dark:border-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 cursor-pointer rounded">
                {courses.current_page - 1}
              </button>
            )}
            <button className="px-4 py-2 font-medium transition-colors border bg-green-950 dark:bg-white text-white dark:text-green-950 border-green-950 dark:border-white cursor-pointer rounded">
              {courses.current_page}
            </button>
            {courses.current_page < courses.last_page && (
              <button onClick={() => router.get('/courses', buildPaginationParams(courses.current_page + 1))} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-green-950 dark:text-white border-green-950 dark:border-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 cursor-pointer rounded">
                {courses.current_page + 1}
              </button>
            )}
            {courses.current_page < courses.last_page - 1 && (
              <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
            )}
            <button onClick={() => router.get('/courses', buildPaginationParams(courses.current_page + 1))} disabled={courses.current_page === courses.last_page} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded" aria-label={t('nextPage')}>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => router.get('/courses', buildPaginationParams(courses.last_page))} disabled={courses.current_page === courses.last_page} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded" aria-label={t('lastPage')}>
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}