import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'

import TrackingPage from './pages/TrackingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import CustomersPage from './pages/CustomersPage'
import KanbanPage from './pages/KanbanPage'
import InventoryPage from './pages/InventoryPage'
import InvoicePage from './pages/InvoicePage'
import WarrantyPage from './pages/WarrantyPage'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/track/:token" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="tickets/:id/invoice" element={<InvoicePage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="warranty" element={<WarrantyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
