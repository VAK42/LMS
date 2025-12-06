import { Head, Link } from '@inertiajs/react';
import { PlayCircle, Clock, Star, CheckCircle, Users, Share2, Heart, FileText, Download, Award } from 'lucide-react';
import Layout from '../components/Layout';
interface Module {
  moduleId: number;
  moduleTitle: string;
  lessonCount: number;
  duration: number;
  lessons: Lesson[];
}
interface Lesson {
  lessonId: number;
  lessonTitle: string;
  duration: number;
  lessonType: string;
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
    whatYouLearn: string[];
    modules: Module[];
    videoDuration: number;
    articlesCount: number;
    resourcesCount: number;
    hasCertificate: boolean;
  };
  user: any;
}
export default function CourseDetail({ course, user }: CourseDetailProps) {
  return (
    <Layout user={user}>
      <Head title={course.courseTitle} />
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                <Link href="/courses" className="hover:text-blue-300">{course.category.categoryName}</Link>
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
                  <span className="text-slate-400 ml-1">({course.ratingsCount.toLocaleString()} Ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount.toLocaleString()} Students Enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span>Last Updated: {new Date(course.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Share2 className="w-6 h-6" />
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
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Course Content
              </h2>
              <div className="space-y-4">
                {course.modules.map((module, i) => (
                  <div key={module.moduleId} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">Module {i + 1}: {module.moduleTitle}</span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{module.lessonCount} Lessons • {module.duration}m</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {module.lessons.map((lesson, j) => (
                        <div key={lesson.lessonId} className="p-4 pl-12 flex justify-between items-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">Lesson {j + 1}: {lesson.lessonTitle}</span>
                          </div>
                          <span className="text-sm text-slate-400">{lesson.duration}:00</span>
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
                <div className="aspect-video bg-slate-200 dark:bg-slate-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    ${course.price.toFixed(2)}
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 mb-4">
                    Add To Cart
                  </button>
                  <button className="w-full py-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                    Buy Now
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-4">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
                <div className="px-6 pb-6 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-700 mt-4 pt-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">This Course Includes:</h3>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4" />
                      {course.videoDuration} Hours On-Demand Video
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      {course.articlesCount} Articles
                    </li>
                    <li className="flex items-center gap-3">
                      <Download className="w-4 h-4" />
                      {course.resourcesCount} Downloadable Resources
                    </li>
                    {course.hasCertificate && (
                      <li className="flex items-center gap-3">
                        <Award className="w-4 h-4" />
                        Certificate Of Completion
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}