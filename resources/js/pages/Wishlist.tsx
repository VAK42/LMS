import { Head } from '@inertiajs/react';
import { Heart, ShoppingCart } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Layout from '../components/Layout';
interface WishlistProps {
  wishlists: Array<{
    wishlistId: number;
    course: {
      courseId: number;
      courseTitle: string;
      courseDescription: string;
      simulatedPrice: number;
      courseImage: string;
      averageRating: number;
    };
    createdAt: string;
  }>;
  user: any;
}
export default function WishlistPage({ wishlists, user }: WishlistProps) {
  return (
    <Layout user={user}>
      <Head title="My Wishlist" />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          My Wishlist
        </h1>
        {wishlists.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-10 h-10 text-slate-400" />}
            title="Your Wishlist Is Empty"
            description="Save Courses You're Interested In To Review Later"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map(item => (
              <div
                key={item.wishlistId}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <img
                  src={item.course.courseImage || '/placeholder.jpg'}
                  alt={item.course.courseTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {item.course.courseTitle}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {item.course.courseDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${item.course.simulatedPrice}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/courses/${item.course.courseId}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Enroll
                      </a>
                    </div>
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