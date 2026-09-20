import React from 'react'

function CustomerTable({ customers = [], loading = false, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-neutral-600">Memuat data pelanggan...</div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-neutral-600">Belum ada pelanggan terdaftar.</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead>
          <tr className="bg-neutral-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Telepon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Alamat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Terdaftar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-900">
                  {customer.full_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-900">{customer.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-600">{customer.email || '-'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-neutral-600 max-w-xs truncate">
                  {customer.address || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {formatDate(customer.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  onClick={() => onEdit(customer)}
                  className="text-signal-inprogress hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="text-signal-cancelled hover:text-red-700"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable