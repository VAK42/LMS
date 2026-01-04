import { Trash2, Award, Download, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Edit } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
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
        const successMsg = (page.props as any).success || t('certificateCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('certificateCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCertificate) return;
    router.post(`/admin/certificates/${selectedCertificate.certificateId}`, { ...data, _method: 'PUT' }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('certificateUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedCertificate(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('certificateUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (certificateId: number) => {
    if (confirm(t('deleteCertificateConfirm'))) {
      router.post(`/admin/certificates/${certificateId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('certificateDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('certificateDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleExportAllCertificates = async () => {
    try {
      const response = await fetch('/admin/certificates/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
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
      showToast(t('certificatesExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportCertificatesFailed'), 'error');
    }
  };
  const columns = [
    {
      key: 'certificateId',
      label: t('id'),
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-600" />
          <span>#{value}</span>
        </div>
      )
    },
    {
      key: 'user',
      label: t('student'),
      render: (_: any, row: Certificate) => row.user.userName
    },
    {
      key: 'course',
      label: t('course'),
      render: (_: any, row: Certificate) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'issuedAt',
      label: t('issuedDate'),
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
      label: t('certificate'),
      render: (value: string | null) => {
        if (!value) {
          return <span className="text-zinc-500">{t('notGenerated')}</span>;
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <Download className="w-4 h-4" />
            {t('download')}
          </a>
        );
      }
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Certificate) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} title={t('editUser')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.certificateId)} title={t('delete')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    {
      name: 'userId',
      label: t('user'),
      type: 'select' as const,
      required: true,
      options: users.map(u => ({ value: u.userId.toString(), label: `${u.userName} (${u.userEmail})` }))
    },
    {
      name: 'courseId',
      label: t('course'),
      type: 'select' as const,
      required: true,
      options: courses.map(c => ({ value: c.courseId.toString(), label: c.courseTitle }))
    },
    { name: 'uniqueCode', label: t('uniqueCode'), type: 'text' as const, required: true },
    { name: 'pdfPath', label: t('pdfPath'), type: 'text' as const, required: false },
    { name: 'issuedAt', label: t('issuedDate'), type: 'date' as const, required: true }
  ];
  return (
    <Layout user={user}>
      <Head title={t('certificateManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/certificates" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('certificateManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageCertificatesSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium cursor-pointer">
                <Award className="w-5 h-5" />
                {t('createCertificate')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchCertificates')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={certificates.data} exportable={true} keyField="certificateId" onExport={handleExportAllCertificates} />
            {certificates.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page - 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
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
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.current_page + 1), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/certificates', buildPaginationParams(certificates.last_page), { preserveState: true, only: ['certificates'] })} disabled={certificates.current_page === certificates.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewCertificate')} fields={formFields} submitLabel={t('createCertificate')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCertificate(null); }} onSubmit={handleEdit} title={t('editCertificateWithId', { id: selectedCertificate?.certificateId?.toString() || '' })} fields={formFields} initialData={selectedCertificate ? { userId: selectedCertificate.user.userId.toString(), courseId: selectedCertificate.course.courseId.toString(), uniqueCode: selectedCertificate.certificateUrl || '', pdfPath: selectedCertificate.certificateUrl || '', issuedAt: new Date(selectedCertificate.issuedAt).toISOString().split('T')[0] } : {}} submitLabel={t('updateCertificate')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}