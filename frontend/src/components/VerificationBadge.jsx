import React from 'react'

export const VerificationBadge = ({ status = 'unverified', role = 'farmer', size = 'sm' }) => {
  const isVerified = status === 'verified'
  const isPending = status === 'pending'

  const sizeStyles = {
    sm: { padding: '0.2rem 0.6rem', fontSize: '0.72rem' },
    md: { padding: '0.35rem 0.85rem', fontSize: '0.82rem' },
    lg: { padding: '0.5rem 1.1rem', fontSize: '0.9rem' }
  }

  const currentSize = sizeStyles[size] || sizeStyles.sm

  if (isVerified) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          borderRadius: '20px',
          fontWeight: 700,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          ...currentSize
        }}
      >
        <span style={{ fontSize: '0.85em' }}>✓</span> Verified {role === 'buyer' ? 'Buyer' : 'Farmer'}
      </span>
    )
  }

  if (isPending) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          borderRadius: '20px',
          fontWeight: 700,
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          ...currentSize
        }}
      >
        <span style={{ fontSize: '0.85em' }}>⏳</span> Verification Pending
      </span>
    )
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        borderRadius: '20px',
        fontWeight: 600,
        backgroundColor: 'rgba(156, 163, 175, 0.12)',
        color: '#9ca3af',
        border: '1px solid rgba(156, 163, 175, 0.25)',
        ...currentSize
      }}
    >
      <span style={{ fontSize: '0.85em' }}>🏢</span> Unverified Account
    </span>
  )
}

export default VerificationBadge
