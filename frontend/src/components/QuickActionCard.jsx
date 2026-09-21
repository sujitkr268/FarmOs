import React from 'react'

export const QuickActionCard = ({ title, subtitle, icon, onClick, color = 'emerald' }) => {
  const iconBgs = {
    emerald: 'rgba(16, 185, 129, 0.15)',
    amber: 'rgba(245, 158, 11, 0.15)',
    blue: 'rgba(59, 130, 246, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)'
  }

  const iconColors = {
    emerald: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    purple: '#a855f7'
  }

  return (
    <button onClick={onClick} className="quick-action-btn">
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        backgroundColor: iconBgs[color] || iconBgs.emerald,
        color: iconColors[color] || iconColors.emerald,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>{subtitle}</div>}
      </div>
    </button>
  )
}

export default QuickActionCard
