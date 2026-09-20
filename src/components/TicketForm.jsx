import React, { useState } from 'react'

function TicketForm({ customers = [], devices = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({
    customer_id: '',
    device_id: '',
    device_serial: '',
    device_imei: '',
    device_password: '',
    issue_description: '',
    priority: 'normal',
  })
  const [submitting, setSubmitting] = useState(false)

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

  const priorityOptions = [
    { value: 'low', label: 'Rendah' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Tinggi' },
    { value: 'urgent', label: 'Urgent' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Pelanggan *
          </label>
          <select
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
            required
          >
            <option value="">Pilih Pelanggan</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name} ({customer.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Perangkat
          </label>
          <select
            name="device_id"
            value={form.device_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          >
            <option value="">Pilih Perangkat</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.brand} {device.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Serial Perangkat
          </label>
          <input
            type="text"
            name="device_serial"
            value={form.device_serial}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            IMEI
          </label>
          <input
            type="text"
            name="device_imei"
            value={form.device_imei}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Prioritas
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Password Perangkat
        </label>
        <input
          type="text"
          name="device_password"
          value={form.device_password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Deskripsi Keluhan *
        </label>
        <textarea
          name="issue_description"
          value={form.issue_description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-signal-inprogress"
          placeholder="Jelaskan kerusakan atau keluhan..."
          required
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
          {submitting ? 'Membuat...' : 'Buat Tiket'}
        </button>
      </div>
    </form>
  )
}

export default TicketForm