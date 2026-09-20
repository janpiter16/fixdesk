import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { authApi } from '../utils/api'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.login(email, password)
      const { token, user } = response.data
      login(user, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
          <h1 className="text-2xl font-bold text-neutral-50 mb-2">FixDesk</h1>
          <p className="text-neutral-400 mb-6">Sistem Manajemen Tiket Servis</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-50 focus:outline-none focus:border-signal-inprogress"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-50 focus:outline-none focus:border-signal-inprogress"
                required
              />
            </div>

            {error && (
              <div className="text-signal-cancelled text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-signal-inprogress text-neutral-50 rounded-md font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
