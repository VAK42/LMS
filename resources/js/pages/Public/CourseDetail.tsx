import { PlayCircle, Clock, Star, CheckCircle, Users, Share2, Heart, FileText, Download, Award, MessageSquare } from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';
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
    courseImage?: string | null;
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
      <div className="bg-green-950 text-white dark:bg-white dark:text-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-600 text-sm font-medium">
                <Link href={`/courses?category=${course.category.categoryId}`} className="hover:text-white dark:hover:text-green-950 transition-colors">{course.category.categoryName}</Link>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif text-white dark:text-green-950 leading-tight">
                {course.courseTitle}
              </h1>
              <p className="text-lg text-zinc-300 dark:text-zinc-600 leading-relaxed max-w-2xl">
                {course.courseDescription}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <span className="font-medium text-lg text-white dark:text-green-950">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-zinc-400 ml-1">{course.ratingsCount > 0 ? course.ratingsCount.toLocaleString() : 0} {t('ratings')}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-600">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount.toLocaleString()} {t('studentsEnrolled')}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-600">
                  <Clock className="w-4 h-4" />
                  <span>{t('lastUpdated')} {new Date(course.lastUpdated).toLocaleDateString((usePage().props as any).locale, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                {!isEnrolled && (
                  <button onClick={handleWishlistToggle} disabled={wishlistLoading} className={`p-2 rounded transition-colors cursor-pointer ${inWishlist ? 'bg-red-500/20 text-red-500' : 'bg-white/10 dark:bg-green-950/10 hover:bg-white/20 dark:hover:bg-green-950/20 text-white dark:text-green-950'}`}>
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}
                <button onClick={() => { if (navigator.share) { navigator.share({ title: course.courseTitle, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); showToast(t('courseLinkCopied'), 'success'); } }} className="p-2 rounded bg-white/10 dark:bg-green-950/10 hover:bg-white/20 dark:hover:bg-green-950/20 transition-colors cursor-pointer text-white dark:text-green-950">
                  <Share2 className="w-6 h-6" />
                </button>
                <button onClick={() => { if (isEnrolled) { router.visit(`/courses/${course.courseId}/discussions`); } else { showToast(t('enrollToDiscuss'), 'error'); } }} className={`p-2 rounded transition-colors cursor-pointer text-white dark:text-green-950 ${isEnrolled ? 'bg-white/10 dark:bg-green-950/10 hover:bg-white/20 dark:hover:bg-green-950/20' : 'bg-white/5 dark:bg-green-950/5 opacity-50 cursor-not-allowed'}`} title={isEnrolled ? t('discussions') : t('enrollToDiscuss')}>
                  <MessageSquare className="w-6 h-6" />
                </button>
                <button onClick={() => { if (isEnrolled) { router.visit(`/courses/${course.courseId}/reviews`) } else { showToast(t('enrollToReview'), 'error'); } }} className={`p-2 rounded transition-colors cursor-pointer text-white dark:text-green-950 ${isEnrolled ? 'bg-white/10 dark:bg-green-950/10 hover:bg-white/20 dark:hover:bg-green-950/20' : 'bg-white/5 dark:bg-green-950/5 opacity-50 cursor-not-allowed'}`} title={isEnrolled ? t('reviews') : t('enrollToReview')}>
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
            <div className="bg-white dark:bg-zinc-900 rounded p-8 border border-green-950 dark:border-white">
              <h2 className="text-2xl font-serif text-green-950 dark:text-white mb-6">
                {t('whatYouWillLearn')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-950 dark:text-white flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-serif text-green-950 dark:text-white mb-6">
                {t('courseContent')}
              </h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.moduleId} className="border border-green-950 dark:border-white rounded overflow-hidden">
                    <div className="bg-green-950 dark:bg-white p-4 flex justify-between items-center cursor-pointer hover:bg-green-900 dark:hover:bg-zinc-100 transition-colors border-b border-green-950 dark:border-white">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white dark:text-green-950">{module.moduleTitle}</span>
                      </div>
                      <span className="text-sm text-zinc-300 dark:text-zinc-600">{module.lessonCount} {t('lessons')} • {module.duration}{t('minutesAbbr')}</span>
                    </div>
                    <div className="divide-y divide-green-950 dark:divide-white">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.lessonId} className="p-4 pl-12 flex justify-between items-center bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-700 dark:text-zinc-300">{lesson.lessonTitle}</span>
                          </div>
                          <span className="text-sm text-zinc-400">{lesson.duration} {t('minutesShort')}</span>
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
              <div className="bg-white dark:bg-zinc-900 rounded shadow-lg border border-green-950 dark:border-white overflow-hidden transform lg:-translate-y-32">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 border-b border-green-950 dark:border-white relative overflow-hidden flex items-center justify-center">
                  {course.courseImage ? (
                    <img src={`/storage/${course.courseImage}`} alt={course.courseTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-white dark:bg-zinc-900 w-full h-full flex items-center justify-center grayscale">
                      <PlayCircle className="w-16 h-16 text-zinc-900 dark:text-white opacity-60" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-3xl font-serif text-green-950 dark:text-white mb-4">
                    {course.price === 0 ? t('free') : <>{t('currencySymbol')}{course.price.toFixed(2)}</>}
                  </div>
                  {isEnrolled ? (
                    <div className="w-full py-4 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium text-center rounded flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {t('purchased')}
                    </div>
                  ) : (
                    <button onClick={handleBuyNow} className="w-full py-4 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-white border border-transparent transition-colors mb-4 cursor-pointer rounded">
                      {t('buyNow')}
                    </button>
                  )}
                </div>
                <div className="px-6 pb-6 pt-0 space-y-4 border-t border-green-950 dark:border-white mt-4 pt-4">
                  <h3 className="font-medium text-green-950 dark:text-white">{t('thisCourseIncludes')}</h3>
                  <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
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
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} course={{ courseId: course.courseId, courseTitle: course.courseTitle, price: course.price }} adminQrPath={adminQrPath} />
    </Layout>
  )
}