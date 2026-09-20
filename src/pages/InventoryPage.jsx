import React, { useState, useEffect } from 'react'
import { partApi } from '../utils/api'

function InventoryPage() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    part_code: '',
    name: '',
    category: '',
    unit: 'pcs',
    purchase_price: '',
    selling_price: '',
    stock_qty: '',
    min_stock: '',
  })

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    setLoading(true)
    try {
      const response = await partApi.getAll()
      setParts(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await partApi.create(form)
      setShowForm(false)
      setForm({
        part_code: '',
        name: '',
        category: '',
        unit: 'pcs',
        purchase_price: '',
        selling_price: '',
        stock_qty: '',
        min_stock: '',
      })
      fetchParts()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Inventaris Spare Part</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-signal-inprogress text-white rounded-md font-medium hover:bg-blue-600"
        >
          {showForm ? 'Batal' : '+ Tambah Part'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Kode Part</label>
              <input
                type="text"
                required
                value={form.part_code}
                onChange={(e) => setForm({ ...form, part_code: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Nama Part</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Kategori</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Satuan</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Harga Beli</label>
              <input
                type="number"
                required
                value={form.purchase_price}
                onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Harga Jual</label>
              <input
                type="number"
                required
                value={form.selling_price}
                onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Stok Awal</label>
              <input
                type="number"
                value={form.stock_qty}
                onChange={(e) => setForm({ ...form, stock_qty: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-600 mb-1">Batas Minimum</label>
              <input
                type="number"
                value={form.min_stock}
                onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-signal-inprogress text-white text-sm rounded font-medium">
              Simpan Spare Part
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-neutral-500">Kode</th>
              <th className="px-6 py-3 text-left font-medium text-neutral-500">Nama</th>
              <th className="px-6 py-3 text-left font-medium text-neutral-500">Kategori</th>
              <th className="px-6 py-3 text-right font-medium text-neutral-500">Harga Jual</th>
              <th className="px-6 py-3 text-right font-medium text-neutral-500">Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {parts.map((part) => (
              <tr key={part.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-mono text-neutral-600">{part.part_code}</td>
                <td className="px-6 py-4 font-medium text-neutral-900">{part.name}</td>
                <td className="px-6 py-4 text-neutral-500">{part.category || '-'}</td>
                <td className="px-6 py-4 text-right font-mono">
                  Rp {Number(part.selling_price).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    part.stock_qty <= part.min_stock
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {part.stock_qty} {part.unit}
                  </span>
                </td>
              </tr>
            ))}
            {parts.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-neutral-400">
                  Belum ada data spare part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryPage
