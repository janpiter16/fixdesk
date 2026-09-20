import React from 'react'

const statusColors = {
  pending: 'bg-signal-pending',
  inspecting: 'bg-signal-pending',
  waiting_approval: 'bg-signal-pending',
  in_progress: 'bg-signal-inprogress',
  completed: 'bg-signal-completed',
  ready_pickup: 'bg-signal-completed',
  delivered: 'bg-neutral-500',
  cancelled: 'bg-signal-cancelled',
}

const statusLabels = {
  pending: 'Pending',
  inspecting: 'Inspeksi',
  waiting_approval: 'Menunggu Persetujuan',
  in_progress: 'Dalam Pengerjaan',
  completed: 'Selesai',
  ready_pickup: 'Siap Diambil',
  delivered: 'Terambil',
  cancelled: 'Dibatalkan',
}

const priorityColors = {
  low: 'bg-neutral-100 text-neutral-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-yellow-100 text-yellow-700',
  urgent: 'bg-red-100 text-red-700',
}

const priorityLabels = {
  low: 'Rendah',
  normal: 'Normal',
  high: 'Tinggi',
  urgent: 'Urgent',
}

function TicketTable({ tickets = [], loading = false, onView }) {
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
        <div className="text-neutral-600">Memuat tiket...</div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-neutral-600">Belum ada tiket.</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead>
          <tr className="bg-neutral-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              No. Tiket
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Pelanggan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Perangkat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Prioritas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-mono font-semibold text-neutral-900">
                  {ticket.ticket_number}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-900">{ticket.customer_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-900">
                  {ticket.brand} {ticket.model}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] || statusColors.pending} text-white`}
                >
                  {statusLabels[ticket.status] || ticket.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || priorityColors.normal}`}
                >
                  {priorityLabels[ticket.priority] || ticket.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {formatDate(ticket.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onView(ticket.id)}
                  className="text-signal-inprogress hover:text-blue-700"
                >
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketTable