import React from 'react'

export const MetricCard = ({ title, value, icon, subtitle, color = 'emerald' }) => {
  const colorThemes = {
    emerald: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    amber: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    blue: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
    purple: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' }
  }

  const theme = colorThemes[color] || colorThemes.emerald

  return (
    <div className="stat-metric-card" style={{ minWidth: 0, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: theme.bg,
          color: theme.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0
        }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.1rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.78rem', color: theme.text, fontWeight: 600, marginTop: '0.6rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default MetricCard
