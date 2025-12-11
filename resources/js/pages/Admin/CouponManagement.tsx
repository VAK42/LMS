import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Clock } from 'lucide-react';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
interface Coupon {
  couponId: number;
  couponCode: string;
  discountType: string;
  discountValue: number;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}
interface Props {
  coupons: {
    data: Coupon[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
  user: any;
}
export default function CouponManagement({ coupons, filters, user }: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    router.get('/admin/coupons', { search: searchTerm, status: statusFilter }, { preserveState: true });
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/coupons', data, {
      onSuccess: () => setIsCreateModalOpen(false)
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCoupon) return;
    router.put(`/admin/coupons/${selectedCoupon.couponId}`, data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedCoupon(null);
      }
    });
  };
  const handleDelete = (couponId: number) => {
    if (confirm('Are You Sure You Want To Delete This Coupon?')) {
      router.delete(`/admin/coupons/${couponId}`);
    }
  };
  const openEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };
  const columns = [
    {
      key: 'couponCode',
      label: 'Code',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-600" />
          <span className="font-mono font-bold text-black dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'discountType',
      label: 'Discount',
      render: (_: any, row: Coupon) => (
        <span className="font-medium text-black dark:text-white">
          {row.discountType === 'percentage' ? `${row.discountValue}%` : `$${row.discountValue}`}
        </span>
      )
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      sortable: true,
      render: (value: string | null, row: Coupon) => {
        if (!value) return <span className="text-zinc-500">Never</span>;
        const expired = isExpired(value);
        return (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${expired ? 'text-red-600' : 'text-zinc-600'}`} />
            <span className={expired ? 'text-red-600' : ''}>{new Date(value).toLocaleDateString()}</span>
          </div>
        );
      }
    },
    {
      key: 'usageCount',
      label: 'Usage',
      render: (_: any, row: Coupon) => (
        <span className="text-sm">
          {row.usageCount} / {row.usageLimit || '∞'}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean, row: Coupon) => {
        const expired = isExpired(row.expiresAt);
        const limitReached = row.usageLimit && row.usageCount >= row.usageLimit;
        const actuallyActive = value && !expired && !limitReached;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${actuallyActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {actuallyActive ? 'Active' : expired ? 'Expired' : limitReached ? 'Limit Reached' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Coupon) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.couponId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    { name: 'couponCode', label: 'Coupon Code', type: 'text' as const, required: true },
    {
      name: 'discountType',
      label: 'Discount Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed Amount' }
      ]
    },
    { name: 'discountValue', label: 'Discount Value', type: 'number' as const, required: true },
    { name: 'expiresAt', label: 'Expiration Date', type: 'date' as const, required: false },
    { name: 'usageLimit', label: 'Usage Limit', type: 'number' as const, required: false },
    {
      name: 'isActive',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Coupon Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/coupons" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Coupon Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage Discount Codes & Promotions</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="w-5 h-5" />
                Add Coupon
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search Coupons..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button onClick={handleSearch} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Search
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={coupons.data} searchable={false} exportable={true} />
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create New Coupon" fields={formFields} submitLabel="Create Coupon" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCoupon(null); }} onSubmit={handleEdit} title="Edit Coupon" fields={formFields} initialData={selectedCoupon ? { couponCode: selectedCoupon.couponCode, discountType: selectedCoupon.discountType, discountValue: selectedCoupon.discountValue, expiresAt: selectedCoupon.expiresAt, usageLimit: selectedCoupon.usageLimit, isActive: selectedCoupon.isActive } : {}} submitLabel="Update Coupon" />
          </div>
        </div>
      </div>
    </Layout>
  )
}