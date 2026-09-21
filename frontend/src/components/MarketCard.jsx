import React from 'react'

export const MarketCard = ({ market, isRecommended = false, onViewDetails }) => {
  if (!market) return null

  const {
    name = 'Local Mandi',
    price = '₹2,500',
    distance = '15 km',
    freight = '₹350',
    netReturn = '₹12,150',
    recommendation = 'Close proximity with low freight.'
  } = market

  return (
    <div
      className="farm-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: isRecommended ? '2px solid #10b981' : '1px solid rgba(31, 64, 46, 0.8)',
        backgroundColor: isRecommended ? 'rgba(16, 185, 129, 0.08)' : '#0f2218',
        boxShadow: isRecommended ? '0 4px 20px rgba(16, 185, 129, 0.2)' : 'none',
        position: 'relative'
      }}
    >
      <div>
        {isRecommended && (
          <span style={{
            display: 'inline-block',
            backgroundColor: '#10b981',
            color: '#06120c',
            fontWeight: 800,
            fontSize: '0.68rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            marginBottom: '0.6rem',
            textTransform: 'uppercase'
          }}>
            Recommended Mandi
          </span>
        )}

        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
          📍 {name}
        </h4>

        <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Price:</span>
            <strong style={{ color: '#10b981' }}>{price}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Distance:</span>
            <strong style={{ color: '#f3f4f6' }}>{distance}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Freight Cost:</span>
            <strong style={{ color: '#f59e0b' }}>{freight}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', pt: '0.25rem', borderTop: '1px solid rgba(31, 64, 46, 0.6)' }}>
            <span style={{ fontWeight: 600 }}>Est. Net Return:</span>
            <strong style={{ color: '#34d399', fontSize: '1rem', fontWeight: 800 }}>{netReturn}</strong>
          </div>
        </div>

        {recommendation && (
          <p style={{ fontSize: '0.78rem', color: '#9ca3af', backgroundColor: '#091811', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.85rem' }}>
            💡 {recommendation}
          </p>
        )}
      </div>

      <button
        onClick={onViewDetails}
        style={{
          width: '100%',
          padding: '0.55rem',
          backgroundColor: isRecommended ? '#10b981' : '#14291d',
          color: isRecommended ? '#06120c' : '#f3f4f6',
          border: isRecommended ? 'none' : '1px solid rgba(31, 64, 46, 0.8)',
          fontWeight: 700,
          borderRadius: '10px',
          fontSize: '0.82rem'
        }}
      >
        View Market Details
      </button>
    </div>
  )
}

export default MarketCard
