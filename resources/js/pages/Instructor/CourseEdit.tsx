import { Head } from '@inertiajs/react';
import Layout from '../../components/Layout';
interface Props {
  course: any;
  user: any;
}
export default function CourseEdit({ course, user }: Props) {
  return (
    <Layout user={user}>
      <Head title={`Edit ${course.courseTitle}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Edit Course: {course.courseTitle}
        </h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <p className="text-slate-600 dark:text-slate-400">
            Coming Soon...
          </p>
        </div>
      </div>
    </Layout>
  )
}