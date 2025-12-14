import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Award, Download, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Edit } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
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
  users: Array<{ userId: number; userName: string; userEmail: string }>;
  courses: Array<{ courseId: number; courseTitle: string }>;
  filters: {
    search?: string;
  };
  user: any;
}
export default function CertificateManagement({ certificates, users, courses, filters, user }: Props) {
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
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
  const openEditModal = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsEditModalOpen(true);
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/certificates', data, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || 'Certificate Created Successfully!';
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || 'Failed To Create Certificate!';
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCertificate) return;
    router.post(`/admin/certificates/${selectedCertificate.certificateId}`, { ...data, _method: 'PUT' }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || 'Certificate Updated Successfully!';
        setIsEditModalOpen(false);
        setSelectedCertificate(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || 'Failed To Update Certificate!';
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (certificateId: number) => {
    if (confirm('Are You Sure You Want To Delete This Certificate?')) {
      router.post(`/admin/certificates/${certificateId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || 'Certificate Deleted Successfully!';
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || 'Failed To Delete Certificate!';
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleExportAllCertificates = async () => {
    try {
      const response = await fetch('/admin/certificates/export');
      if (!response.ok) throw new Error('Export Failed');
      const allCertificates = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allCertificates.map((cert: Certificate) => exportColumns.map(col => {
        let value = cert[col.key as keyof Certificate];
        if ((col.key === 'issuedAt' || col.key === 'expiresAt') && value) value = new Date(value as string).toLocaleDateString();
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Certificates.csv';
      link.click();
      URL.revokeObjectURL(url);
      showToast('Certificates Exported Successfully!', 'success');
    } catch (error) {
      showToast('Failed To Export Certificates!', 'error');
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
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} title="Edit" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.certificateId)} title="Delete" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    {
      name: 'userId',
      label: 'User',
      type: 'select' as const,
      required: true,
      options: users.map(u => ({ value: u.userId.toString(), label: `${u.userName} (${u.userEmail})` }))
    },
    {
      name: 'courseId',
      label: 'Course',
      type: 'select' as const,
      required: true,
      options: courses.map(c => ({ value: c.courseId.toString(), label: c.courseTitle }))
    },
    { name: 'uniqueCode', label: 'Unique Code', type: 'text' as const, required: true },
    { name: 'pdfPath', label: 'PDF Path', type: 'text' as const, required: false },
    { name: 'issuedAt', label: 'Issued Date', type: 'date' as const, required: true }
  ];
  return (
    <Layout user={user}>
      <Head title="Certificate Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/certificates" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Certificate Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">View & Manage Course Completion Certificates</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium cursor-pointer">
                <Award className="w-5 h-5" />
                Create Certificate
              </button>
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
            <DataTable columns={columns} data={certificates.data} exportable={true} keyField="certificateId" onExport={handleExportAllCertificates} />
            {certificates.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page - 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous Page">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {certificates.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {certificates.current_page > 1 && (
                  <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page - 1), { preserveState: true, only: ['certificates'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {certificates.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {certificates.current_page}
                </button>
                {certificates.current_page < certificates.last_page && (
                  <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page + 1), { preserveState: true, only: ['certificates'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {certificates.current_page + 1}
                  </button>
                )}
                {certificates.current_page < certificates.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page + 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next Page">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.last_page), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last Page">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create New Certificate" fields={formFields} submitLabel="Create Certificate" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCertificate(null); }} onSubmit={handleEdit} title={`Edit Certificate #${selectedCertificate?.certificateId || ''}`} fields={formFields} initialData={selectedCertificate ? { userId: selectedCertificate.user.userId.toString(), courseId: selectedCertificate.course.courseId.toString(), uniqueCode: selectedCertificate.certificateUrl || '', pdfPath: selectedCertificate.certificateUrl || '', issuedAt: new Date(selectedCertificate.issuedAt).toISOString().split('T')[0] } : {}} submitLabel="Update Certificate" />
          </div>
        </div>
      </div>
    </Layout>
  )
}