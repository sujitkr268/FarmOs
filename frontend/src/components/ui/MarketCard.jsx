import React from 'react'

export const MarketCard = ({ market, isBest = false, onViewDetails }) => {
  if (!market) return null

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: isBest ? '2px solid #10b981' : '1px solid #e2e8f0',
      borderRadius: '18px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      boxShadow: isBest ? '0 8px 24px rgba(16, 185, 129, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.2s ease-in-out'
    }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {market.market || market.name || 'Mandi Market'}
          </h4>
          <span style={{
            backgroundColor: isBest ? '#10b981' : '#e2e8f0',
            color: isBest ? '#ffffff' : '#475569',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '12px'
          }}>
            {isBest ? 'Best Option' : (market.recommendation || 'Good')}
          </span>
        </div>

        {/* Price Tag */}
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isBest ? '#10b981' : '#0f172a', marginBottom: '1rem' }}>
          ₹{market.price ? Number(market.price).toLocaleString() : '2,100'} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>/ quintal</span>
        </div>

        {/* Metrics Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🚗 Distance</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{market.distance || '120 km'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🚚 Freight Cost</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{market.freight ? Number(market.freight).toLocaleString() : '2,800'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>📈 Net Return</span>
            <span style={{ fontWeight: 800, color: isBest ? '#10b981' : '#059669', fontSize: '0.95rem' }}>
              ₹{market.net_return ? Number(market.net_return).toLocaleString() : '7,700'}
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onViewDetails}
        style={{
          width: '100%',
          padding: '0.65rem',
          borderRadius: '10px',
          backgroundColor: isBest ? '#10b981' : '#f1f5f9',
          color: isBest ? '#ffffff' : '#334155',
          fontWeight: 700,
          fontSize: '0.85rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: isBest ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none'
        }}
      >
        View Details
      </button>
    </div>
  )
}
