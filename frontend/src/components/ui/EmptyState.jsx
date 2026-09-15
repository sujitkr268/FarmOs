import React from 'react'

export const EmptyState = ({ icon = '🌾', title = 'No Data Available', description, actionText, onAction }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      color: '#64748b'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>{title}</h4>
      {description && <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.25rem' }}>{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.65rem 1.35rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
