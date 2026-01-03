import { BookOpen, TrendingUp, Users, Award, ArrowRight, Star, CheckCircle, User } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
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
      <section className="relative bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-black dark:text-white tracking-tight">
              Transform Your Future With
              <span className="block mt-2">
                Cutting-Edge Skills
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Master In-Demand Technologies, Build Real-World Projects & Accelerate Your Career With Expert-Led Courses Designed For Success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link
                href="/courses"
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors w-full sm:w-auto text-center"
              >
                Explore Courses
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border border-black dark:border-white text-black dark:text-white font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 mb-4">
                <BookOpen className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">500+</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Expert Courses</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 mb-4">
                <Users className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">50K+</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Active Learners</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 mb-4">
                <Award className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">30K+</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Certificates Issued</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 mb-4">
                <TrendingUp className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">95%</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-3">
                Featured Courses
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Explore Our Most Popular & Highly-Rated Courses
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden sm:flex items-center text-black dark:text-white font-medium hover:underline transition-colors"
            >
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link
                key={course.courseId}
                href={`/courses/${course.courseId}`}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-black dark:hover:border-white transition-colors"
              >
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider">
                      {course.category.categoryName}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-2 group-hover:underline transition-colors">
                    {course.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-black dark:text-white">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">({course.rating})</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {course.instructor.userName}
                      </span>
                    </div>
                    <span className="font-bold text-black dark:text-white">
                      {!course.price || course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/courses"
              className="inline-flex items-center text-black dark:text-white font-medium hover:underline transition-colors"
            >
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Everything You Need To Succeed In Your Learning Journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-5 bg-zinc-100 dark:bg-zinc-800 mb-6">
                <CheckCircle className="w-10 h-10 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-3">
                Expert Instructors
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Learn From Industry Professionals With Years Of Real-World Experience
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-5 bg-zinc-100 dark:bg-zinc-800 mb-6">
                <CheckCircle className="w-10 h-10 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-3">
                Flexible Learning
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Study At Your Own Pace With Lifetime Access To Course Materials
              </p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex p-5 bg-zinc-100 dark:bg-zinc-800 mb-6">
                <CheckCircle className="w-10 h-10 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-3">
                Career Support
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Get Career Guidance & Certificate To Boost Your Professional Growth
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}