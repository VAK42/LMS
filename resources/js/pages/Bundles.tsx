import { Head, Link } from '@inertiajs/react';
import { Package, ShoppingCart, Star } from 'lucide-react';
import Layout from '../components/Layout';
interface Bundle {
  bundleId: number;
  bundleTitle: string;
  bundleDescription: string;
  bundlePrice: number;
  originalPrice: number;
  bundleImage: string;
  isActive: boolean;
  courses: Course[];
}
interface Course {
  courseId: number;
  courseTitle: string;
  courseImage: string;
  instructor: {
    userName: string;
  };
}
interface BundlesProps {
  bundles: Bundle[];
  user: any;
}
export default function Bundles({ bundles, user }: BundlesProps) {
  return (
    <Layout user={user}>
      <Head title="Course Bundles" />
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Course Bundles
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Save Big With Our Curated Course Packages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => (
              <div key={bundle.bundleId} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save {Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100)}%
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{bundle.courses.length} Courses</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {bundle.bundleTitle}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {bundle.bundleDescription}
                  </p>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-slate-500 line-through">${bundle.originalPrice.toFixed(2)}</p>
                        <p className="text-2xl font-bold text-blue-600">${bundle.bundlePrice.toFixed(2)}</p>
                      </div>
                      <Link
                        href={`/bundles/${bundle.bundleId}`}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Included Courses:</p>
                      {bundle.courses.slice(0, 3).map((course) => (
                        <div key={course.courseId} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {course.courseTitle}
                        </div>
                      ))}
                      {bundle.courses.length > 3 && (
                        <p className="text-xs text-slate-500">+{bundle.courses.length - 3} more courses</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}