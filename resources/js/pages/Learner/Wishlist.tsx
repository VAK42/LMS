import { Heart, BookOpen } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface WishlistProps {
  wishlists: {
    data: Array<{
      wishlistId: number;
      course: {
        courseId: number;
        courseTitle: string;
        courseDescription: string;
        simulatedPrice: number;
        courseImage: string | null;
        averageRating: number;
      };
      createdAt: string;
    }>;
  };
  user: any;
}
export default function WishlistPage({ wishlists, user }: WishlistProps) {
  const { t } = useTranslation();
  return (
    <Layout user={user}>
      <Head title={t('myWishlist')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif text-green-950 dark:text-white mb-8">
          {t('myWishlist')}
        </h1>
        {wishlists.data.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
            <Heart className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-green-950 dark:text-white mb-2">
              {t('yourWishlistIsEmpty')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {t('saveCourses')}
            </p>
            <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors rounded">
              {t('browseCourses')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlists.data.map(item => (
              <div key={item.wishlistId} className="group bg-white dark:bg-zinc-900 border border-green-950 dark:border-white overflow-hidden hover:border-green-800 dark:hover:border-zinc-200 transition-colors rounded">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative border-b border-green-950 dark:border-white">
                  {item.course.courseImage ? (
                    <img src={`/storage/${item.course.courseImage}`} alt={item.course.courseTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-serif text-green-950 dark:text-white mb-1 line-clamp-2">
                      {item.course.courseTitle}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {item.course.courseDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl text-green-950 dark:text-white">
                      {t('currencySymbol')}{item.course.simulatedPrice}
                    </span>
                    <Link href={`/courses/${item.course.courseId}`} className="px-4 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors rounded">
                      {t('viewCourse')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}