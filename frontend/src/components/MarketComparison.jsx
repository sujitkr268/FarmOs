import React, { useState } from 'react'

export const MarketComparison = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!data || !data.comparison || data.comparison.length === 0) {
    return null
  }

  const rec = data.recommended || data.comparison[0]
  const list = data.comparison || []

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-gold)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      marginTop: '0.8rem',
      marginBottom: '0.8rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      color: 'var(--text-primary)'
    }}>
      {/* Top Banner: Best Market Highlight */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
              Recommended Opportunity: {rec.market}
            </h3>
            <span style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold-light)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.55rem',
              borderRadius: '12px'
            }}>
              Score: {rec.farmos_opportunity_score}/100
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            📍 {rec.district}, {rec.state} • Commodity: <strong>{data.commodity}</strong> ({data.user_quantity || ''} {data.user_unit || ''})
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Est. Gross Value
          </span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
            ₹{Number(rec.estimated_gross_value).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Rationale Bullet Points */}
      {rec.why && rec.why.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
            Why FarmOS Recommends This Market:
          </strong>
          {rec.why.map((bullet, i) => (
            <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem', display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: '#4ade80' }}>✓</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      )}

      {/* Market Comparison Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.83rem',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>Mandi Market</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>Modal Price</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>Est. Gross</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>Distance</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>Est. Transport</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>FarmOS Score</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, showDetails ? list.length : 5).map((item, idx) => {
              const isWinner = item.market === rec.market
              return (
                <tr key={idx} style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: isWinner ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                  fontWeight: isWinner ? 700 : 400
                }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: isWinner ? 'var(--accent-gold-light)' : 'var(--text-primary)' }}>
                    {isWinner && '🏆 '}{item.market} ({item.district})
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--accent-gold)' }}>
                    ₹{Number(item.modal_price).toLocaleString()}/qtl
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)' }}>
                    ₹{Number(item.estimated_gross_value).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {item.estimated_distance}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {item.estimated_transport_cost}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span style={{
                      backgroundColor: isWinner ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: isWinner ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}>
                      {item.farmos_opportunity_score}/100
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Show Details Toggle if > 5 markets */}
      {list.length > 5 && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold-light)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.2rem 0',
            marginBottom: '0.8rem',
            textDecoration: 'underline'
          }}
        >
          {showDetails ? '▲ Show Top 5 Only' : `▼ View All ${list.length} Mandi Markets`}
        </button>
      )}

      {/* Warnings & Source Attribution Footer */}
      <div style={{
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.65rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        {rec.warnings && rec.warnings.map((warn, wIdx) => (
          <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>⚠</span>
            <span>{warn}</span>
          </div>
        ))}
        <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
          🏛️ <strong>Source:</strong> {data.data_source || 'Govt of India Agmarknet (data.gov.in)'} • 
          <span style={{ marginLeft: '0.4rem', fontStyle: 'italic' }}>
            FarmOS Opportunity Score is calculated from modal price strength & price-range consistency.
          </span>
        </div>
      </div>
    </div>
  )
}
