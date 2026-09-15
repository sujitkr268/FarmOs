import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '1.2rem' }}>Loading authentication session...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to /login and save current location in state for post-login return
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Unauthorized role access: redirect to user's appropriate dashboard
    if (user.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />
    if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}
