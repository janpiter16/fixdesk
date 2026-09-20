import React, { useState, useEffect } from 'react'
import { ticketApi } from '../utils/api'

const columns = [
  { id: 'pending', title: 'Pending', color: 'border-yellow-400' },
  { id: 'inspecting', title: 'Inspeksi', color: 'border-blue-400' },
  { id: 'in_progress', title: 'Pengerjaan', color: 'border-indigo-400' },
  { id: 'completed', title: 'Selesai', color: 'border-green-400' },
  { id: 'ready_pickup', title: 'Siap Diambil', color: 'border-emerald-500' },
]

function KanbanPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const response = await ticketApi.getAll()
      setTickets(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketApi.updateStatus(ticketId, newStatus)
      fetchTickets()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Kanban Board Teknisi</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTickets = tickets.filter((t) => t.status === col.id)

          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-80 bg-neutral-100 rounded-lg p-4 flex flex-col max-h-[calc(100vh-200px)]"
            >
              <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${col.color}`}>
                <h3 className="font-semibold text-neutral-800">{col.title}</h3>
                <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full font-mono">
                  {colTickets.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {colTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-4 rounded shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-neutral-600">
                        {ticket.ticket_number}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <h4 className="font-medium text-sm text-neutral-900 mb-1">
                      {ticket.brand} {ticket.model}
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
                      {ticket.customer_name}
                    </p>

                    <div className="flex justify-between items-center border-t border-neutral-100 pt-2 mt-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className="text-xs border border-neutral-300 rounded px-1.5 py-1 bg-neutral-50 focus:outline-none"
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <a
                        href={`/tickets/${ticket.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Detail
                      </a>
                    </div>
                  </div>
                ))}

                {colTickets.length === 0 && (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanPage
