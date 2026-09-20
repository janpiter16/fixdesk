import React, { useState, useEffect } from 'react'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'
import { customerApi } from '../utils/api'

function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerApi.getAll()
      setCustomers(response.data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomer = async (data) => {
    try {
      await customerApi.create(data)
      setShowForm(false)
      fetchCustomers()
    } catch (err) {
      console.error('Failed to create customer:', err)
      throw err
    }
  }

  const handleUpdateCustomer = async (data) => {
    try {
      await customerApi.update(editingCustomer.id, data)
      setEditingCustomer(null)
      setShowForm(false)
      fetchCustomers()
    } catch (err) {
      console.error('Failed to update customer:', err)
      throw err
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDelete = async (customerId) => {
    if (!confirm('Hapus pelanggan ini?')) return

    try {
      await customerApi.delete(customerId)
      fetchCustomers()
    } catch (err) {
      console.error('Failed to delete customer:', err)
      alert('Gagal menghapus pelanggan')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Daftar Pelanggan</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-signal-inprogress text-white rounded-md font-medium hover:bg-blue-600"
        >
          + Pelanggan Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <CustomerForm
            customer={editingCustomer}
            onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-neutral-200">
        <CustomerTable
          customers={customers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default CustomersPage
