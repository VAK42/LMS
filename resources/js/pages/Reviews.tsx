import { Head } from '@inertiajs/react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import Layout from '../components/Layout';
interface Review {
  reviewId: number;
  rating: number;
  reviewText: string;
  instructorResponse: string | null;
  helpfulCount: number;
  user: {
    userName: string;
  };
  createdAt: string;
}
interface ReviewsPageProps {
  reviews: { data: Review[] };
  averageRating: number;
  ratingDistribution: Record<number, number>;
  courseTitle: string;
  user: any;
}
export default function Reviews({ reviews, averageRating, ratingDistribution, courseTitle, user }: ReviewsPageProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };
  return (
    <Layout user={user}>
      <Head title={`Reviews - ${courseTitle}`} />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 dark:text-white mb-2">
                {averageRating}
              </div>
              <div className="flex gap-1 mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {reviews.data.length} Reviews
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-12">{rating} Star</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${((ratingDistribution[rating] || 0) / reviews.data.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm w-12 text-right">{ratingDistribution[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {reviews.data.map(review => (
            <div
              key={review.reviewId}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {review.user.userName}
                  </p>
                  <div className="flex gap-1 mt-1">{renderStars(review.rating)}</div>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">{review.reviewText}</p>
              {review.instructorResponse && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                      Instructor Response
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {review.instructorResponse}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}