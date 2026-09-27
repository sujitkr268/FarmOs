import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RoleDashboardRedirect = () => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />

  const isOrders = location.pathname.includes('/orders')
  const searchParam = isOrders ? '?tab=orders' : location.search

  if (user.role === 'farmer') return <Navigate to={`/farmer/dashboard${searchParam}`} replace />
  if (user.role === 'buyer') return <Navigate to={`/buyer/dashboard${searchParam}`} replace />
  if (user.role === 'admin') return <Navigate to={`/admin/dashboard${searchParam}`} replace />
  return <Navigate to="/" replace />
}

export default RoleDashboardRedirect
