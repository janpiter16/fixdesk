import React from 'react'
import useAuthStore from '../stores/authStore'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-sm text-neutral-500 mb-1">Total Tiket</div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-sm text-neutral-500 mb-1">Dalam Pengerjaan</div>
          <div className="text-3xl font-bold text-signal-inprogress">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-sm text-neutral-500 mb-1">Selesai Hari Ini</div>
          <div className="text-3xl font-bold text-signal-completed">0</div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Selamat Datang, {user?.full_name}</h2>
        <p className="text-neutral-600">Role: {user?.role}</p>
      </div>
    </div>
  )
}

export default DashboardPage
