import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RoleDashboardRedirect = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />
  if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/" replace />
}
