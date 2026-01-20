import { BookOpen, TrendingUp, Users, Award, ArrowRight, Star, CheckCircle, User } from 'lucide-react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Head, Link } from '@inertiajs/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Course {
  courseId: number;
  courseTitle: string;
  category: {
    categoryName: string;
  };
  instructor: {
    userName: string;
  };
  price: number;
  rating: number;
  courseImage: string | null;
}
interface HomeProps {
  featuredCourses: Course[];
  user: any;
}
export default function Home({ featuredCourses, user }: HomeProps) {
  const { t } = useTranslation();
  return (
    <Layout user={user}>
      <Head title={t('home')} />
      <section className="relative bg-green-950 text-white dark:bg-white dark:text-green-950 min-h-[600px] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Swiper modules={[Autoplay, Navigation]} spaceBetween={30} centeredSlides={true} autoplay={{ delay: 5000, disableOnInteraction: false }} className="w-full">
            <SwiperSlide>
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white dark:text-green-950 tracking-tight mb-8">
                  {t('homeTitle')}
                  <span className="block mt-2">
                    {t('cuttingEdgeSkills')}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 dark:text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-12">
                  {t('homeSubtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/courses" className="px-8 py-3 bg-white text-green-950 border border-white hover:bg-green-950 hover:text-white dark:bg-green-950 dark:text-white dark:border-green-950 dark:hover:bg-white dark:hover:text-green-950 transition-colors w-full sm:w-auto text-center rounded cursor-pointer">
                    {t('exploreCourses')}
                  </Link>
                  <Link href="/register" className="px-8 py-3 border border-white text-white hover:bg-white hover:text-green-950 dark:border-green-950 dark:text-green-950 dark:hover:bg-green-950 dark:hover:text-white transition-colors w-full sm:w-auto text-center rounded cursor-pointer">
                    {t('getStartedFree')}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white dark:text-green-950 tracking-tight mb-8">
                  {t('expertInstructors')}
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 dark:text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-12">
                  {t('expertInstructorsDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/courses" className="px-8 py-3 bg-white text-green-950 border border-white hover:bg-green-950 hover:text-white dark:bg-green-950 dark:text-white dark:border-green-950 dark:hover:bg-white dark:hover:text-green-950 transition-colors w-full sm:w-auto text-center rounded cursor-pointer">
                    {t('exploreCourses')}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white dark:text-green-950 tracking-tight mb-8">
                  {t('flexibleLearning')}
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 dark:text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-12">
                  {t('flexibleLearningDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/register" className="px-8 py-3 bg-white text-green-950 border border-white hover:bg-green-950 hover:text-white dark:bg-green-950 dark:text-white dark:border-green-950 dark:hover:bg-white dark:hover:text-green-950 transition-colors w-full sm:w-auto text-center rounded cursor-pointer">
                    {t('getStartedFree')}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-black border-b border-green-950 dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-4 bg-green-950 mb-4 rounded text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{t('stats.expertCoursesCount')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('expertCourses')}</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-4 bg-green-950 mb-4 rounded text-white">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{t('stats.activeLearnersCount')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('activeLearners')}</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-4 bg-green-950 mb-4 rounded text-white">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{t('stats.certificatesIssuedCount')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('certificatesIssued')}</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-4 bg-green-950 mb-4 rounded text-white">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{t('stats.successRatePercent')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('successRate')}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-green-950 dark:text-white mb-3">
                {t('featuredCourses')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                {t('popularCoursesSubtitle')}
              </p>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center text-green-950 dark:text-white hover:underline transition-colors cursor-pointer">
              {t('viewAllCourses')} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link key={course.courseId} href={`/courses/${course.courseId}`} className="group bg-white dark:bg-zinc-900 border border-green-950 dark:border-white overflow-hidden transition-colors rounded cursor-pointer">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  {course.courseImage ? (
                    <img src={`/storage/${course.courseImage}`} alt={course.courseTitle} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <BookOpen className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-green-950 dark:bg-white text-white dark:text-green-950 text-xs uppercase tracking-wider rounded">
                      {course.category.categoryName}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-green-950 dark:text-white mb-2 group-hover:underline transition-colors">
                    {course.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">({course.rating})</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-white">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {course.instructor.userName}
                      </span>
                    </div>
                    <span className="text-lg font-serif text-green-950 dark:text-white">
                      {!course.price || course.price === 0 ? t('free') : <>{t('currencySymbol')}{course.price.toFixed(2)}</>}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link href="/courses" className="inline-flex items-center text-green-950 dark:text-white hover:underline transition-colors cursor-pointer">
              {t('viewAllCourses')} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-black border-t border-green-950 dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-green-950 dark:text-white mb-4">
              {t('whyChoosePlatform')}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {t('whyChooseSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-5 bg-green-950 mb-6 rounded text-white">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif text-green-950 dark:text-white mb-3">
                {t('expertInstructors')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t('expertInstructorsDesc')}
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-5 bg-green-950 mb-6 rounded text-white">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif text-green-950 dark:text-white mb-3">
                {t('flexibleLearning')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t('flexibleLearningDesc')}
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded transition-colors">
              <div className="inline-flex p-5 bg-green-950 mb-6 rounded text-white">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif text-green-950 dark:text-white mb-3">
                {t('careerSupport')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t('careerSupportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}