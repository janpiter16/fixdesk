import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketApi } from '../utils/api'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'inspecting', label: 'Inspeksi' },
  { value: 'waiting_approval', label: 'Menunggu Persetujuan' },
  { value: 'in_progress', label: 'Dalam Pengerjaan' },
  { value: 'completed', label: 'Selesai' },
  { value: 'ready_pickup', label: 'Siap Diambil' },
  { value: 'delivered', label: 'Terambil' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    setLoading(true)
    try {
      const response = await ticketApi.getById(id)
      setTicket(response.data)
    } catch (err) {
      console.error('Failed to fetch ticket:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await ticketApi.updateStatus(id, newStatus)
      fetchTicket()
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleAssign = async () => {
    // TODO: implement assign functionality
    console.log('Assign ticket')
  }

  const handlePrintReceipt = () => {
    // TODO: implement print functionality
    console.log('Print receipt')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-neutral-600">Memuat detail tiket...</div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-900 text-lg font-medium mb-2">Tiket tidak ditemukan</div>
        <button
          onClick={() => navigate('/tickets')}
          className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300"
        >
          Kembali ke Daftar Tiket
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Tiket #{ticket.ticket_number}
          </h1>
          <p className="text-neutral-600">
            Dibuat: {new Date(ticket.created_at).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handlePrintReceipt}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50"
          >
            Cetak QR
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-signal-inprogress text-white rounded-md font-medium hover:bg-blue-600"
          >
            Assign Teknisi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Informasi Pelanggan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-500">Nama</div>
                <div className="text-neutral-900 font-medium">{ticket.customer_name}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Telepon</div>
                <div className="text-neutral-900 font-medium">{ticket.customer_phone}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Email</div>
                <div className="text-neutral-900">{ticket.customer_email || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Informasi Perangkat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-500">Perangkat</div>
                <div className="text-neutral-900 font-medium">
                  {ticket.device_brand} {ticket.device_model}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Serial</div>
                <div className="font-mono text-neutral-900">{ticket.device_serial || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">IMEI</div>
                <div className="font-mono text-neutral-900">{ticket.device_imei || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Password</div>
                <div className="text-neutral-900">{ticket.device_password || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Keluhan</h2>
            <p className="text-neutral-900 whitespace-pre-wrap">{ticket.issue_description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Status & Prioritas</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-neutral-500 mb-2">Status Saat Ini</div>
                <div className="text-lg font-semibold text-neutral-900 capitalize">
                  {ticket.status.replace('_', ' ')}
                </div>
              </div>

              <div>
                <div className="text-sm text-neutral-500 mb-2">Perbarui Status</div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(status.value)}
                      disabled={updating || ticket.status === status.value}
                      className={`px-3 py-1 text-sm rounded-md ${ticket.status === status.value ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-neutral-500 mb-2">Prioritas</div>
                <div className="text-lg font-semibold text-neutral-900 capitalize">
                  {ticket.priority}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Informasi Biaya</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="text-neutral-600">Estimasi Biaya</div>
                <div className="font-mono font-semibold">
                  {ticket.estimated_cost ? `Rp ${ticket.estimated_cost.toLocaleString('id-ID')}` : '-'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-neutral-600">Biaya Akhir</div>
                <div className="font-mono font-semibold">
                  {ticket.final_cost ? `Rp ${ticket.final_cost.toLocaleString('id-ID')}` : '-'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Tracking</h2>
            <div className="text-sm text-neutral-500 mb-2">Tracking URL</div>
            <div className="font-mono text-sm text-neutral-900 break-all bg-neutral-50 p-3 rounded">
              {window.location.origin}/track/{ticket.tracking_token}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetailPage