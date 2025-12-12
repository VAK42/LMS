import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
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
      onSuccess: () => {
        setIsCreateModalOpen(false);
        showToast('User Created Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Create User! Please Try Again!', 'error');
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
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        showToast('User Updated Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Update User! Please Try Again!', 'error');
      }
    });
  };
  const handleDelete = (userId: number) => {
    if (confirm('Are You Sure You Want To Delete This User?')) {
      router.post(`/admin/users/${userId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: () => {
          showToast('User Deleted Successfully!', 'success');
        },
        onError: () => {
          showToast('Failed To Delete User! Please Try Again!', 'error');
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
  const columns = [
    { key: 'userName', label: 'Name', sortable: true },
    { key: 'userEmail', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : value === 'instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'emailVerifiedAt',
      label: 'Verified',
      render: (value: string | null) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
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
    { name: 'userName', label: 'Name', type: 'text' as const, required: true },
    { name: 'userEmail', label: 'Email', type: 'email' as const, required: true },
    { name: 'password', label: 'Password', type: 'text' as const, required: !selectedUser },
    {
      name: 'role',
      label: 'Role',
      type: 'select' as const,
      required: true,
      placeholder: 'Select Role',
      options: [
        { value: 'learner', label: 'Learner' },
        { value: 'instructor', label: 'Instructor' }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title="User Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/users" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">User Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage All Users, Roles & Permissions</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Name Or Email..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">All Roles</option>
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={users.data} exportable={true} keyField="userId" />
            {users.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/users', buildPaginationParams(1), { preserveState: true, only: ['users'] })} disabled={users.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page - 1), { preserveState: true, only: ['users'] })} disabled={users.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous Page">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {users.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {users.current_page > 1 && (
                  <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page - 1), { preserveState: true, only: ['users'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white">
                    {users.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {users.current_page}
                </button>
                {users.current_page < users.last_page && (
                  <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page + 1), { preserveState: true, only: ['users'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white">
                    {users.current_page + 1}
                  </button>
                )}
                {users.current_page < users.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.current_page + 1), { preserveState: true, only: ['users'] })} disabled={users.current_page === users.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next Page">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/users', buildPaginationParams(users.last_page), { preserveState: true, only: ['users'] })} disabled={users.current_page === users.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Last Page">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create New User" fields={formFields} submitLabel="Create User" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} onSubmit={handleEdit} title="Edit User" fields={formFields} initialData={selectedUser ? { userName: selectedUser.userName, userEmail: selectedUser.userEmail, role: selectedUser.role } : {}} submitLabel="Update User" />
          </div>
        </div>
      </div>
    </Layout>
  )
}