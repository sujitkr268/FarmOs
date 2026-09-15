import React from 'react'

export const QuickActionCard = ({ icon, title, description, color = 'emerald', onClick }) => {
  const colorStyles = {
    emerald: { bg: '#e6f4ea', color: '#10b981' },
    blue: { bg: '#e0f2fe', color: '#0284c7' },
    amber: { bg: '#fef3c7', color: '#d97706' },
    purple: { bg: '#f3e8ff', color: '#9333ea' }
  }

  const selectedColor = colorStyles[color] || colorStyles.emerald

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      }}
      className="quick-action-hover"
    >
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: selectedColor.bg,
        color: selectedColor.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        flexShrink: 0
      }}>
        {icon}
      </div>

      <div>
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
          {description}
        </div>
      </div>
    </div>
  )
}
