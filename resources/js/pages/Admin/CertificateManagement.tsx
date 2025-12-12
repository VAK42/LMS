import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Award, Download, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
interface Certificate {
  certificateId: number;
  user: { userId: number; userName: string };
  course: { courseId: number; courseTitle: string };
  certificateUrl: string | null;
  issuedAt: string;
}
interface Props {
  certificates: {
    data: Certificate[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
  };
  user: any;
}
export default function CertificateManagement({ certificates, filters, user }: Props) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = () => {
    const params: { search?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    router.get('/admin/certificates', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    return params;
  };
  const handleDelete = (certificateId: number) => {
    if (confirm('Are You Sure You Want To Delete This Certificate?')) {
      router.post(`/admin/certificates/${certificateId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: () => showToast('Certificate Deleted Successfully!', 'success'),
        onError: () => showToast('Failed To Delete Certificate! Please Try Again!', 'error')
      });
    }
  };
  const columns = [
    {
      key: 'certificateId',
      label: 'ID',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-600" />
          <span>#{value}</span>
        </div>
      )
    },
    {
      key: 'user',
      label: 'Student',
      render: (_: any, row: Certificate) => row.user.userName
    },
    {
      key: 'course',
      label: 'Course',
      render: (_: any, row: Certificate) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'issuedAt',
      label: 'Issued Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'certificateUrl',
      label: 'Certificate',
      render: (value: string | null) => {
        if (!value) {
          return <span className="text-zinc-500">Not Generated</span>;
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <Download className="w-4 h-4" />
            Download
          </a>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Certificate) => (
        <button onClick={() => handleDelete(row.certificateId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Certificate Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/certificates" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Certificate Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400">View & Manage Course Completion Certificates</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Student Or Course..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={certificates.data} exportable={true} keyField="certificateId" />
            {certificates.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page - 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{certificates.current_page}</button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page + 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.last_page), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}