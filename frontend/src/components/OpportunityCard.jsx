import React from 'react'

export const OpportunityCard = ({ opportunity, onViewDetails }) => {
  if (!opportunity) return null

  const {
    crop = 'Produce',
    quantity = '500 kg',
    bestMarket = 'Kolkata Central Mandi',
    marketPrice = '₹2,800 / quintal',
    distance = '35 km',
    travelTime = '1.2 hrs',
    freight = '₹650',
    grossRevenue = '₹14,000',
    estNetReturn = '₹13,350'
  } = opportunity

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 34, 24, 0.95) 100%)',
      border: '2px solid #10b981',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Best Opportunity Badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#10b981',
        color: '#06120c',
        fontWeight: 800,
        fontSize: '0.72rem',
        padding: '0.3rem 0.75rem',
        borderRadius: '20px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
      }}>
        🌟 BEST OPPORTUNITY
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
          Crop: {crop} ({quantity})
        </span>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
          📍 {bestMarket}
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1rem',
        backgroundColor: '#091811',
        padding: '1rem',
        borderRadius: '14px',
        border: '1px solid rgba(31, 64, 46, 0.8)',
        marginBottom: '1.25rem'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Market Price</span>
          <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>{marketPrice}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Distance & Time</span>
          <strong style={{ fontSize: '0.95rem', color: '#f3f4f6' }}>{distance} ({travelTime})</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Freight Cost</span>
          <strong style={{ fontSize: '0.95rem', color: '#f59e0b' }}>{freight}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Est. Net Return</span>
          <strong style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>{estNetReturn}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          Gross Revenue: <span style={{ color: '#f3f4f6', fontWeight: 700 }}>{grossRevenue}</span>
        </div>
        <button
          onClick={onViewDetails}
          style={{
            padding: '0.65rem 1.35rem',
            backgroundColor: '#10b981',
            color: '#06120c',
            fontWeight: 800,
            borderRadius: '12px',
            fontSize: '0.88rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            width: 'auto'
          }}
        >
          View Full Opportunity
        </button>
      </div>
    </div>
  )
}

export default OpportunityCard
