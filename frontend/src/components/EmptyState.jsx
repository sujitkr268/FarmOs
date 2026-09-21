import React from 'react'

export const EmptyState = ({ icon = '🌾', title = 'No Data Found', description = 'There are no items to display right now.', actionText, onAction }) => {
  return (
    <div style={{
      backgroundColor: '#0f2218',
      border: '1px solid rgba(31, 64, 46, 0.8)',
      borderRadius: '18px',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      color: '#9ca3af'
    }}>
      <div style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>{icon}</div>
      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>{title}</h4>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af', maxWidth: '400px', margin: '0 auto 1.25rem auto', lineHeight: 1.4 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.6rem 1.35rem',
            backgroundColor: '#10b981',
            color: '#06120c',
            fontWeight: 700,
            borderRadius: '10px',
            fontSize: '0.85rem'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
