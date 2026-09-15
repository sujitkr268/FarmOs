import React from 'react'
import TrustBadge from '../TrustBadge'
import { Link } from 'react-router-dom'

export const FarmProfileCard = ({ user }) => {
  if (!user) return null

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '1.5rem',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.2rem' }}>🧑‍🌾</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Farm Profile
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        {/* User Avatar Circle */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#0b2319',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.5rem',
          flexShrink: 0
        }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {user.name}
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>
            {user.role || 'Farmer'}
          </span>
        </div>
      </div>

      {/* Details List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📍</span>
          <span>{user.location || user.village || 'Kolkata, West Bengal'}</span>
        </div>

        {user.farm_size && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌱</span>
            <span>Farm Size: <strong>{user.farm_size}</strong></span>
          </div>
        )}

        {user.crops_grown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌾</span>
            <span>Main Crops: <strong>{user.crops_grown}</strong></span>
          </div>
        )}
      </div>

      {/* Verification Badge */}
      <div style={{ marginBottom: '1.25rem' }}>
        <TrustBadge status={user.verification_status} role={user.role} size="sm" />
      </div>

      {/* View Profile Link */}
      <Link
        to="/profile"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#10b981',
          fontWeight: 700,
          fontSize: '0.88rem'
        }}
      >
        View Profile →
      </Link>
    </div>
  )
}
