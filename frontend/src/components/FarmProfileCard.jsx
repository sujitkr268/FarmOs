import React from 'react'
import { Link } from 'react-router-dom'
import { VerificationBadge } from './VerificationBadge'

export const FarmProfileCard = ({ user }) => {
  if (!user) return null

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'F'

  return (
    <div style={{
      backgroundColor: '#0f2218',
      border: '1px solid rgba(31, 64, 46, 0.8)',
      borderRadius: '18px',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: '#06120c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.4rem',
          flexShrink: 0
        }}>
          {initial}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f3f4f6', lineHeight: 1.2 }}>
            {user.name}
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
            {user.role} Account
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(31, 64, 46, 0.6)' }}>
          <span style={{ color: '#9ca3af' }}>Location</span>
          <span style={{ color: '#f3f4f6', fontWeight: 600 }}>📍 {user.location || 'Bardhaman'}</span>
        </div>
        {user.farm_size && (
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(31, 64, 46, 0.6)' }}>
            <span style={{ color: '#9ca3af' }}>Farm Size</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{user.farm_size}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '0.2rem' }}>
          <span style={{ color: '#9ca3af' }}>Verification</span>
          <VerificationBadge status={user.verification_status} role={user.role} size="sm" />
        </div>
      </div>

      <Link
        to="/profile"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '0.6rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10b981',
          fontWeight: 700,
          fontSize: '0.82rem'
        }}
      >
        View & Edit Farm Profile
      </Link>
    </div>
  )
}

export default FarmProfileCard
