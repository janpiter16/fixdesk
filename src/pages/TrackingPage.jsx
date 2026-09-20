import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ticketApi } from '../utils/api'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-signal-pending' },
  inspecting: { label: 'Inspeksi', color: 'bg-signal-pending' },
  waiting_approval: { label: 'Menunggu Persetujuan', color: 'bg-signal-pending' },
  in_progress: { label: 'Dalam Pengerjaan', color: 'bg-signal-inprogress' },
  completed: { label: 'Selesai', color: 'bg-signal-completed' },
  ready_pickup: { label: 'Siap Diambil', color: 'bg-signal-completed' },
  delivered: { label: 'Terambil', color: 'bg-neutral-500' },
  cancelled: { label: 'Dibatalkan', color: 'bg-signal-cancelled' },
}

function TrackingPage() {
  const { token } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketApi.track(token)
        setTicket(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Tiket tidak ditemukan')
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-neutral-200 p-6">
          <div className="text-signal-cancelled text-lg font-semibold mb-2">Tiket Tidak Ditemukan</div>
          <p className="text-neutral-600">{error}</p>
        </div>
      </div>
    )
  }

  const status = statusConfig[ticket.status] || statusConfig.pending

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 p-6">
            <h1 className="text-xl font-bold text-neutral-50 mb-1">FixDesk</h1>
            <p className="text-neutral-400 text-sm">Tracking Servis</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="text-sm text-neutral-500 mb-1">Nomor Tiket</div>
              <div className="text-2xl font-mono font-bold text-neutral-900">{ticket.ticket_number}</div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-neutral-500 mb-2">Status</div>
              <div className={`inline-block px-4 py-2 rounded-full text-white font-medium ${status.color}`}>
                {status.label}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-neutral-500 mb-1">Pelanggan</div>
                <div className="text-neutral-900 font-medium">{ticket.customer_name}</div>
              </div>
              
              <div>
                <div className="text-sm text-neutral-500 mb-1">Perangkat</div>
                <div className="text-neutral-900 font-medium">
                  {ticket.device_brand} {ticket.device_model}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-neutral-500 mb-1">Keluhan</div>
              <div className="text-neutral-900">{ticket.issue_description}</div>
            </div>

            {ticket.estimated_cost && (
              <div className="mb-6">
                <div className="text-sm text-neutral-500 mb-1">Estimasi Biaya</div>
                <div className="text-xl font-mono font-bold text-neutral-900">
                  Rp {ticket.estimated_cost.toLocaleString('id-ID')}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-200">
              <div className="text-xs text-neutral-400">
                Dibuat: {new Date(ticket.created_at).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage
