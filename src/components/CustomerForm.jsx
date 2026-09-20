import React, { useState, useEffect } from 'react'

function CustomerForm({ customer = null, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (customer) {
      setForm({
        full_name: customer.full_name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        notes: customer.notes || '',
      })
    }
  }, [customer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(form)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        {customer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          placeholder="email@contoh.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Alamat
        </label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          placeholder="Alamat lengkap pelanggan..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Catatan
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          placeholder="Catatan tambahan..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-signal-inprogress text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : customer ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm