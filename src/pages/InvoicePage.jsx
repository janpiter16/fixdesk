import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketApi, partApi, apiClient } from '../utils/api'

function InvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [parts, setParts] = useState([])
  const [selectedParts, setSelectedParts] = useState([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paidAmount, setPaidAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [ticketRes, partsRes] = await Promise.all([
        ticketApi.getById(id),
        partApi.getAll(),
      ])
      setTicket(ticketRes.data)
      setParts(partsRes.data)
      setPaidAmount(ticketRes.data.estimated_cost || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPart = (part) => {
    const existing = selectedParts.find((p) => p.part_id === part.id)
    if (existing) {
      setSelectedParts(
        selectedParts.map((p) =>
          p.part_id === part.id ? { ...p, qty: p.qty + 1, subtotal: (p.qty + 1) * p.unit_price } : p
        )
      )
    } else {
      setSelectedParts([
        ...selectedParts,
        {
          part_id: part.id,
          name: part.name,
          unit_price: Number(part.selling_price),
          qty: 1,
          subtotal: Number(part.selling_price),
        },
      ])
    }
  }

  const handleRemovePart = (partId) => {
    setSelectedParts(selectedParts.filter((p) => p.part_id !== partId))
  }

  const subtotalService = ticket?.estimated_cost || 0
  const subtotalParts = selectedParts.reduce((acc, curr) => acc + curr.subtotal, 0)
  const totalAmount = Number(subtotalService) + Number(subtotalParts) - Number(discount)

  const handleCheckout = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await apiClient.post('/invoices', {
        ticket_id: id,
        items: selectedParts,
        discount_amount: discount,
        payment_method: paymentMethod,
        paid_amount: paidAmount,
      })
      alert('Pembayaran berhasil diproses!')
      navigate(`/tickets/${id}`)
    } catch (err) {
      console.error(err)
      alert('Gagal memproses pembayaran')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">POS & Kasir Invoicing</h1>
        <button onClick={() => navigate(-1)} className="text-sm text-neutral-600 hover:underline">
          Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="font-semibold text-neutral-800 mb-4">Informasi Tiket</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">No. Tiket:</span>
                <span className="font-mono font-bold">{ticket.ticket_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Pelanggan:</span>
                <span className="font-medium">{ticket.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Perangkat:</span>
                <span>{ticket.device_brand} {ticket.device_model}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="font-semibold text-neutral-800 mb-4">Tambah Spare Part</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {parts.map((part) => (
                <div key={part.id} className="flex justify-between items-center p-2 hover:bg-neutral-50 border-b border-neutral-100">
                  <div>
                    <div className="text-sm font-medium">{part.name}</div>
                    <div className="text-xs text-neutral-500">Stok: {part.stock_qty} | Rp {Number(part.selling_price).toLocaleString('id-ID')}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddPart(part)}
                    disabled={part.stock_qty <= 0}
                    className="px-3 py-1 bg-neutral-900 text-white text-xs rounded hover:bg-neutral-800 disabled:opacity-50"
                  >
                    + Pilih
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
          <h2 className="font-semibold text-neutral-800">Rincian Pembayaran</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Biaya Jasa Servis:</span>
              <span className="font-mono">Rp {Number(subtotalService).toLocaleString('id-ID')}</span>
            </div>

            {selectedParts.map((p) => (
              <div key={p.part_id} className="flex justify-between items-center text-xs">
                <span>{p.name} x {p.qty}</span>
                <span className="font-mono">Rp {p.subtotal.toLocaleString('id-ID')}</span>
                <button type="button" onClick={() => handleRemovePart(p.part_id)} className="text-red-500 ml-2">x</button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <span>Diskon:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-28 text-right border border-neutral-300 rounded px-2 py-1 text-sm font-mono"
              />
            </div>

            <div className="flex justify-between text-base font-bold pt-2 border-t border-neutral-200">
              <span>Total Tagihan:</span>
              <span className="font-mono text-signal-inprogress">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              >
                <option value="cash">Tunai (Cash)</option>
                <option value="transfer">Transfer Bank</option>
                <option value="qris">QRIS</option>
                <option value="card">Kartu Debit/Kredit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Jumlah Bayar</label>
              <input
                type="number"
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-signal-completed text-white rounded-md font-medium hover:bg-emerald-600 disabled:opacity-50 mt-4"
          >
            {submitting ? 'Memproses...' : 'Proses Pembayaran & Selesaikan Tiket'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default InvoicePage
