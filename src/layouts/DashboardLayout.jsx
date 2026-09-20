import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

function DashboardLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-neutral-50">FixDesk</span>
              </Link>
              
              <div className="ml-10 flex space-x-4">
                <Link
                  to="/"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tickets"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tiket
                </Link>
                <Link
                  to="/customers"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pelanggan
                </Link>
                <Link
                  to="/kanban"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Kanban
                </Link>
                <Link
                  to="/inventory"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Spare Part
                </Link>
                <Link
                  to="/warranty"
                  className="text-neutral-300 hover:text-neutral-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Garansi
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-4 text-neutral-300 text-sm">
                {user?.full_name} <span className="text-neutral-500">({user?.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-neutral-300 hover:text-neutral-50 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
