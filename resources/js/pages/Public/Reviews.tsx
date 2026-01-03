import { Star, MessageSquare, ChevronLeft } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
interface Review {
  reviewId: number;
  rating: number;
  reviewText: string;
  instructorResponse: string | null;
  helpfulCount: number;
  user: { userName: string };
  createdAt: string;
}
interface ReviewsPageProps {
  courseId: number;
  reviews: { data: Review[] };
  user: any;
}
export default function Reviews({ courseId, reviews, user }: ReviewsPageProps) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const renderStars = (r: number) => Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} className={`w-5 h-5 ${i < r ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
  ));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/api/courses/${courseId}/reviews`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ courseId, rating, reviewText }),
      });
      if (response.status === 419) {
        window.location.reload();
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed To Submit Review!', 'error');
        return;
      }
      showToast('Review Submitted Successfully!', 'success');
      setReviewText('');
      router.reload();
    } catch (error) {
      console.error(error);
      showToast('An Error Occurred!', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Layout user={user}>
      <Head title="Course Reviews" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
          <h1 className="text-3xl font-serif font-bold text-black dark:text-white">Course Reviews</h1>
        </div>
        {user && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Write A Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className="cursor-pointer">
                      <Star className={`w-8 h-8 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Your Review</label>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share Your Thoughts..." rows={4} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" required />
              </div>
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
        <div className="space-y-4">
          {reviews.data.map(review => (
            <div key={review.reviewId} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-black dark:text-white">{review.user.userName}</p>
                  <div className="flex gap-1 mt-1">{renderStars(review.rating)}</div>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">{review.reviewText}</p>
              {review.instructorResponse && (
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border-l-4 border-black dark:border-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm font-bold text-black dark:text-white">Instructor Response</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{review.instructorResponse}</p>
                </div>
              )}
            </div>
          ))}
          {reviews.data.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Star className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Reviews Yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Be The First To Review This Course</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}