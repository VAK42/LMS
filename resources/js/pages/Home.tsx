import { Head, Link } from '@inertiajs/react';
import { BookOpen, TrendingUp, Users, Award, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
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
}
interface HomeProps {
  featuredCourses: Course[];
  user: any;
}
export default function Home({ featuredCourses, user }: HomeProps) {
  return (
    <Layout user={user}>
      <Head title="Home" />
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyek0zNiAyMnYySDI0di0yaDEyek0zNiAxOHYySDI0di0yaDEyek0zNiAxNHYySDI0di0yaDEyek0zNiAxMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transform Your Future With
              <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent mt-2">
                Cutting-Edge Skills
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Master In-Demand Technologies, Build Real-World Projects, And Accelerate Your Career With Expert-Led Courses Designed For Success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/courses"
                className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 w-full sm:w-auto"
              >
                Explore Courses
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-blue-800 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all border-2 border-blue-600 w-full sm:w-auto"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-blue-100 dark:border-slate-700">
              <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900 rounded-xl mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">500+</h3>
              <p className="text-slate-600 dark:text-slate-400">Expert Courses</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-green-100 dark:border-slate-700">
              <div className="inline-flex p-4 bg-green-100 dark:bg-green-900 rounded-xl mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">50K+</h3>
              <p className="text-slate-600 dark:text-slate-400">Active Learners</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-purple-100 dark:border-slate-700">
              <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900 rounded-xl mb-4">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">30K+</h3>
              <p className="text-slate-600 dark:text-slate-400">Certificates Issued</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-orange-100 dark:border-slate-700">
              <div className="inline-flex p-4 bg-orange-100 dark:bg-orange-900 rounded-xl mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">95%</h3>
              <p className="text-slate-600 dark:text-slate-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Featured Courses
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Explore Our Most Popular And Highly-Rated Courses
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.courseId} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="aspect-video bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {course.category.categoryName}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">({course.rating})</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {course.instructor.userName}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/courses"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything You Need To Succeed In Your Learning Journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex p-5 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-6">
                <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Expert Instructors
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn From Industry Professionals With Years Of Real-World Experience
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex p-5 bg-green-100 dark:bg-green-900 rounded-2xl mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Flexible Learning
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Study At Your Own Pace With Lifetime Access To Course Materials
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="inline-flex p-5 bg-purple-100 dark:bg-purple-900 rounded-2xl mb-6">
                <CheckCircle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Career Support
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get Career Guidance And Certificate To Boost Your Professional Growth
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}