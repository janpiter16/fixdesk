import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TicketForm from '../components/TicketForm'
import TicketTable from '../components/TicketTable'
import { ticketApi, customerApi, deviceApi } from '../utils/api'

function TicketsPage() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [tickets, setTickets] = useState([])
  const [customers, setCustomers] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
    fetchCustomers()
    fetchDevices()
  }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const response = await ticketApi.getAll()
      setTickets(response.data)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll()
      setCustomers(response.data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await deviceApi.getAll()
      setDevices(response.data)
    } catch (err) {
      console.error('Failed to fetch devices:', err)
    }
  }

  const handleCreateTicket = async (data) => {
    try {
      await ticketApi.create(data)
      setShowForm(false)
      fetchTickets()
    } catch (err) {
      console.error('Failed to create ticket:', err)
      throw err
    }
  }

  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Daftar Tiket</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-signal-inprogress text-white rounded-md font-medium hover:bg-blue-600"
        >
          + Tiket Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <TicketForm
            customers={customers}
            devices={devices}
            onSubmit={handleCreateTicket}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-neutral-200">
        <TicketTable
          tickets={tickets}
          loading={loading}
          onView={handleViewTicket}
        />
      </div>
    </div>
  )
}

export default TicketsPage
