import { PlayCircle, Clock, Star, CheckCircle, Users, Share2, Heart, FileText, Download, Award, MessageSquare } from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import PaymentModal from '../../components/PaymentModal';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Module {
  moduleId: number;
  moduleTitle: string;
  lessonCount: number;
  duration: number;
  lessons: {
    lessonId: number;
    lessonTitle: string;
    duration: number;
    contentType: string;
  }[];
}
interface CourseDetailProps {
  course: {
    courseId: number;
    courseTitle: string;
    courseDescription: string;
    category: {
      categoryId: number;
      categoryName: string;
    };
    rating: number;
    ratingsCount: number;
    studentsCount: number;
    lastUpdated: string;
    price: number;
    whatYouLearn?: string[];
    modules: Module[];
    videoDuration?: number;
    articlesCount?: number;
    resourcesCount?: number;
    hasCertificate?: boolean;
  };
  adminQrPath?: string;
  quiz?: { quizId: number; quizTitle: string } | null;
  assessment?: { assessmentId: number; assessmentTitle: string } | null;
  isEnrolled?: boolean;
  isInWishlist?: boolean;
  user: any;
}
export default function CourseDetail({ course, adminQrPath, isEnrolled, isInWishlist: initialWishlist, user }: CourseDetailProps) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [inWishlist, setInWishlist] = useState(initialWishlist ?? false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const handleBuyNow = () => {
    if (!user) {
      showToast(t('youHaveToLogIn'), 'error');
      setTimeout(() => router.get('/login'), 1000);
      return;
    }
    if (user.role !== 'learner') {
      showToast(t('onlyStudentsPurchase'), 'error');
      return;
    }
    setShowPaymentModal(true);
  };
  const handleWishlistToggle = async () => {
    if (!user) {
      showToast(t('pleaseLogInWishlist'), 'error');
      return;
    }
    if (isEnrolled) {
      showToast(t('alreadyOwnCourse'), 'info');
      return;
    }
    setWishlistLoading(true);
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ courseId: course.courseId })
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      setInWishlist(data.inWishlist);
      showToast(data.message, 'success');
    } catch (error) {
      showToast(t('failedToUpdateWishlist'), 'error');
    } finally {
      setWishlistLoading(false);
    }
  };
  return (
    <Layout user={user}>
      <Head title={course.courseTitle} />
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-zinc-100 text-sm font-medium">
                <Link href={`/courses?category=${course.category.categoryId}`} className="hover:text-white transition-colors">{course.category.categoryName}</Link>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {course.courseTitle}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                {course.courseDescription}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span className="font-bold text-lg">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-slate-400 ml-1">{course.ratingsCount > 0 ? course.ratingsCount.toLocaleString() : 0} {t('ratings')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount.toLocaleString()} {t('studentsEnrolled')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span>{t('lastUpdated')} {new Date(course.lastUpdated).toLocaleDateString((usePage().props as any).locale, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                {!isEnrolled && (
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${inWishlist ? 'bg-red-500/20 text-red-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: course.courseTitle,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showToast(t('courseLinkCopied'), 'success');
                    }
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    if (isEnrolled) {
                      router.visit(`/courses/${course.courseId}/discussions`);
                    } else {
                      showToast(t('enrollToDiscuss'), 'error');
                    }
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${isEnrolled ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'}`}
                  title={isEnrolled ? t('discussions') : t('enrollToDiscuss')}
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    if (isEnrolled) {
                      router.visit(`/courses/${course.courseId}/reviews`)
                    } else {
                      showToast(t('enrollToReview'), 'error');
                    }
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${isEnrolled ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'}`}
                  title={isEnrolled ? t('reviews') : t('enrollToReview')}
                >
                  <Star className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {t('whatYouWillLearn')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {t('courseContent')}
              </h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.moduleId} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">{module.moduleTitle}</span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{module.lessonCount} {t('lessons')} • {module.duration}{t('minutesAbbr')}</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.lessonId} className="p-4 pl-12 flex justify-between items-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">{lesson.lessonTitle}</span>
                          </div>
                          <span className="text-sm text-slate-400">{lesson.duration} {t('minutesShort')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transform lg:-translate-y-32">
                <div className="aspect-video bg-zinc-900 relative grayscale">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-60" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {course.price === 0 ? t('free') : `$${course.price.toFixed(2)}`}
                  </div>
                  {isEnrolled ? (
                    <div className="w-full py-4 bg-zinc-800 dark:bg-white text-white dark:text-black font-bold text-center rounded flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {t('purchased')}
                    </div>
                  ) : (
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-4 bg-zinc-800 dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors mb-4 cursor-pointer"
                    >
                      {t('buyNow')}
                    </button>
                  )}
                </div>
                <div className="px-6 pb-6 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-700 mt-4 pt-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('thisCourseIncludes')}</h3>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4" />
                      {course.videoDuration ?? 0} {t('onDemandVideo')}
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      {course.articlesCount ?? 0} {t('articles')}
                    </li>
                    <li className="flex items-center gap-3">
                      <Download className="w-4 h-4" />
                      {course.resourcesCount ?? 0} {t('downloadableResources')}
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="w-4 h-4" />
                      {t('certificateOfCompletion')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={{ courseId: course.courseId, courseTitle: course.courseTitle, price: course.price }}
        adminQrPath={adminQrPath}
      />
    </Layout>
  )
}