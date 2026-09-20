import React, { useState } from 'react'
import { apiClient } from '../utils/api'

function WarrantyPage() {
  const [ticketNum, setTicketNum] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const check = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiClient.get(`/warranty/check/${ticketNum}`)
      setResult(res.data)
    } catch (err) {
      alert('Tiket tidak ditemukan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Validasi Garansi</h1>
      <form onSubmit={check} className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
        <input
          type="text"
          placeholder="Masukkan Nomor Tiket"
          value={ticketNum}
          onChange={(e) => setTicketNum(e.target.value)}
          className="w-full border border-neutral-300 rounded px-3 py-2"
        />
        <button className="w-full bg-signal-inprogress text-white py-2 rounded">Cek Garansi</button>
      </form>
      {result && (
        <div className={`p-6 rounded-lg ${result.is_valid ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="font-bold">{result.is_valid ? 'GARANSI AKTIF' : 'GARANSI HANGUS'}</div>
          <div>Berlaku s/d: {new Date(result.expires_at).toLocaleDateString('id-ID')}</div>
        </div>
      )}
    </div>
  )
}

export default WarrantyPage