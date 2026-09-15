import React from 'react'

export const MetricCard = ({ icon, title, value, subtitle, color = 'emerald', onClick }) => {
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
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'default'
      }}
      className="metric-card-hover"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: selectedColor.bg,
          color: selectedColor.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {value}
          </div>
          {subtitle && (
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: 700 }}>
        ›
      </div>
    </div>
  )
}
