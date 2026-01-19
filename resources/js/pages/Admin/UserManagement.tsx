import { Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface User {
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
  createdAt: string;
  emailVerifiedAt: string | null;
}
interface Props {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    role?: string;
  };
  user: any;
}
export default function UserManagement({ users, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const handleSearch = () => {
    const params: { search?: string; role?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (roleFilter && roleFilter.trim()) {
      params.role = roleFilter;
    }
    router.get('/admin/users', params, { preserveState: true });
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/users', data, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('userCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('userCreateFailed');
        showToast(errorMsg, 'error');
      },
      onFinish: () => {
        router.reload({ only: ['users'] });
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedUser) return;
    router.post(`/admin/users/${selectedUser.userId}`, {
      ...data,
      _method: 'PUT'
    }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('userUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedUser(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('userUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (userId: number) => {
    if (confirm(t('deleteUserConfirm'))) {
      router.post(`/admin/users/${userId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('userDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('userDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string; role?: string } = { page };
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (roleFilter && roleFilter.trim()) {
      params.role = roleFilter;
    }
    return params;
  };
  const handleExportAllUsers = async () => {
    try {
      const response = await fetch('/admin/users/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allUsers = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allUsers.map((user: User) => exportColumns.map(col => {
        let value = user[col.key as keyof User];
        if (col.key === 'createdAt' && value) {
          value = new Date(value as string).toLocaleDateString();
        } else if (col.key === 'emailVerifiedAt') {
          value = value ? t('yes') : t('no');
        } else if (col.key === 'role' && typeof value === 'string') {
          value = t(value);
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('usersExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('usersExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportUsersFailed'), 'error');
    }
  };
  const columns = [
    { key: 'userName', label: t('name'), sortable: true },
    { key: 'userEmail', label: t('emailAddress'), sortable: true },
    {
      key: 'role',
      label: t('role'),
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : value === 'instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {t(value)}
        </span>
      )
    },
    {
      key: 'emailVerifiedAt',
      label: t('verified'),
      render: (value: string | null) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
          {value ? t('yes') : t('no')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: t('joined'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: User) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.userId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    { name: 'userName', label: t('name'), type: 'text' as const, required: true },
    { name: 'userEmail', label: t('emailAddress'), type: 'email' as const, required: true },
    { name: 'password', label: t('password'), type: 'password' as const, required: !selectedUser, placeholder: selectedUser ? t('leaveEmptyPassword') : t('passwordMinLength') },
    {
      name: 'role',
      label: t('role'),
      type: 'select' as const,
      required: true,
      placeholder: t('selectRole'),
      options: [
        { value: 'learner', label: t('learner') },
        { value: 'instructor', label: t('instructor') }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title={t('userManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/users" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('userManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageUsersSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                {t('addUser')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchByNameOrEmail')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allRoles')}</option>
                  <option value="learner">{t('learner')}</option>
                  <option value="instructor">{t('instructor')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={users.data} exportable={true} keyField="userId" onExport={handleExportAllUsers} />
            {users.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/users', buildPaginationParams(1), { preserveState: true, only: ['users'] })} disabled={users.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page - 1), { preserveState: true, only: ['users'] })} disabled={users.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {users.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {users.current_page > 1 && (
                  <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page - 1), { preserveState: true, only: ['users'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {users.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {users.current_page}
                </button>
                {users.current_page < users.last_page && (
                  <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page + 1), { preserveState: true, only: ['users'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {users.current_page + 1}
                  </button>
                )}
                {users.current_page < users.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page + 1), { preserveState: true, only: ['users'] })} disabled={users.current_page === users.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.last_page), { preserveState: true, only: ['users'] })} disabled={users.current_page === users.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewUser')} fields={formFields} submitLabel={t('createUser')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} onSubmit={handleEdit} title={t('editUser')} fields={formFields} initialData={selectedUser ? { userName: selectedUser.userName, userEmail: selectedUser.userEmail, password: '', role: selectedUser.role } : {}} submitLabel={t('updateUser')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}