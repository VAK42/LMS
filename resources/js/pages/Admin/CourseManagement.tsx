import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import FilterPanel from '../../components/Admin/FilterPanel';
interface Course {
  courseId: number;
  courseTitle: string;
  instructor: { userId: number; userName: string };
  category: { categoryId: number; categoryName: string };
  simulatedPrice: number;
  isPublished: boolean;
  createdAt: string;
}
interface Category {
  categoryId: number;
  categoryName: string;
}
interface Instructor {
  userId: number;
  userName: string;
}
interface Props {
  courses: {
    data: Course[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  categories: Category[];
  instructors: Instructor[];
  filters: {
    search?: string;
    category?: string;
    status?: string;
  };
  user: any;
}
export default function CourseManagement({ courses, categories, instructors, filters, user }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    router.get('/admin/courses', { search: searchTerm, category: categoryFilter, status: statusFilter }, { preserveState: true });
  };
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    router.get('/admin/courses', {}, { preserveState: true });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCourse) return;
    router.put(`/admin/courses/${selectedCourse.courseId}`, data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedCourse(null);
      }
    });
  };
  const handleDelete = (courseId: number) => {
    if (confirm('Are You Sure You Want To Delete This Course?')) {
      router.delete(`/admin/courses/${courseId}`);
    }
  };
  const handleTogglePublish = (course: Course) => {
    router.put(`/admin/courses/${course.courseId}`, {
      ...course,
      isPublished: !course.isPublished,
      categoryId: course.category.categoryId,
      instructorId: course.instructor.userId
    });
  };
  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };
  const columns = [
    { key: 'courseTitle', label: 'Course Title', sortable: true },
    {
      key: 'instructor',
      label: 'Instructor',
      render: (_: any, row: Course) => row.instructor.userName
    },
    {
      key: 'category',
      label: 'Category',
      render: (_: any, row: Course) => row.category.categoryName
    },
    {
      key: 'simulatedPrice',
      label: 'Price',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'isPublished',
      label: 'Status',
      sortable: true,
      render: (value: boolean, row: Course) => (
        <button onClick={() => handleTogglePublish(row)} className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'}`}>
          {value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {value ? 'Published' : 'Draft'}
        </button>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Course) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.courseId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    { name: 'courseTitle', label: 'Course Title', type: 'text' as const, required: true },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName }))
    },
    {
      name: 'instructorId',
      label: 'Instructor',
      type: 'select' as const,
      required: true,
      options: instructors.map(inst => ({ value: inst.userId, label: inst.userName }))
    },
    { name: 'simulatedPrice', label: 'Price', type: 'number' as const, required: true },
    {
      name: 'isPublished',
      label: 'Published',
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: 'Published' },
        { value: '0', label: 'Draft' }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Course Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/courses" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Course Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400">Manage All Courses And Publishing Status</p>
            </div>
            <FilterPanel onClear={handleClearFilters}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search Courses..." className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <button onClick={handleSearch} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Apply Filters
                </button>
              </div>
            </FilterPanel>
            <DataTable columns={columns} data={courses.data} searchable={false} exportable={true} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCourse(null); }} onSubmit={handleEdit} title="Edit Course" fields={formFields} initialData={selectedCourse ? { courseTitle: selectedCourse.courseTitle, categoryId: selectedCourse.category.categoryId, instructorId: selectedCourse.instructor.userId, simulatedPrice: selectedCourse.simulatedPrice, isPublished: selectedCourse.isPublished } : {}} submitLabel="Update Course" />
          </div>
        </div>
      </div>
    </Layout>
  )
}