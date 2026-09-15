import React, { useState } from 'react'

const VEHICLES = {
  mini_truck: { id: 'mini_truck', name: 'Mini Truck (1T / Tata Ace / Pickup)', capacity: 1000, rate: 20, min: 500 },
  small_truck: { id: 'small_truck', name: 'Small Truck (3T / Eicher 14ft)', capacity: 3000, rate: 30, min: 1000 },
  medium_truck: { id: 'medium_truck', name: 'Medium Truck (9T / 6-Wheeler)', capacity: 9000, rate: 45, min: 2000 },
  large_truck: { id: 'large_truck', name: 'Heavy Truck (20T / Multi-Axle)', capacity: 20000, rate: 65, min: 3500 }
}

export const MarketComparison = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState('mini_truck')

  if (!data || !data.comparison || data.comparison.length === 0) {
    return null
  }

  const rawList = data.comparison || []
  const qtyKg = data.quantity_kg || (data.quantity_quintals ? data.quantity_quintals * 100 : 500)
  const vehicleConfig = VEHICLES[selectedVehicle] || VEHICLES.mini_truck
  const vehiclesRequired = Math.ceil(qtyKg / vehicleConfig.capacity)

  // Compute updated logistics metrics for each market based on user's vehicle selection
  const comparisonList = rawList.map((item) => {
    const distanceNum = typeof item.distance_km === 'number' ? item.distance_km : parseFloat(item.estimated_distance)
    let calculatedFreight = null
    let netReturn = item.estimated_gross_value

    if (!isNaN(distanceNum) && distanceNum > 0) {
      const dist = Math.max(1, distanceNum)
      const tripCost = Math.max(vehicleConfig.min, dist * vehicleConfig.rate)
      calculatedFreight = Math.round(tripCost * vehiclesRequired)
      netReturn = Math.max(0, item.estimated_gross_value - calculatedFreight)
    } else if (item.estimated_freight_cost !== null && item.estimated_freight_cost !== undefined) {
      calculatedFreight = item.estimated_freight_cost
      netReturn = item.estimated_net_return || (item.estimated_gross_value - calculatedFreight)
    }

    return {
      ...item,
      computed_freight: calculatedFreight,
      computed_net_return: netReturn
    }
  })

  // Sort by net return if freight is available, else by score
  const hasFreight = comparisonList.some((m) => m.computed_freight !== null)
  if (hasFreight) {
    comparisonList.sort((a, b) => b.computed_net_return - a.computed_net_return)
  }

  const rec = comparisonList[0]

  return (
    <div className="market-comparison-card" style={{
      width: '100%',
      backgroundColor: 'var(--bg-card, #161b22)',
      border: '1px solid var(--border-gold, #d4af37)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      marginTop: '0.8rem',
      marginBottom: '0.8rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
      color: 'var(--text-primary, #f0f6fc)'
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>
              Recommended Market: {rec.market}
            </h3>
            <span style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid #d4af37',
              color: '#fbbf24',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.55rem',
              borderRadius: '12px'
            }}>
              Score: {rec.farmos_opportunity_score}/100
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#8b949e' }}>
            📍 {rec.district}, {rec.state} • Commodity: <strong>{data.commodity}</strong> ({data.user_quantity || ''} {data.user_unit || ''})
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {hasFreight ? 'Est. Net Return' : 'Est. Gross Value'}
          </span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: hasFreight ? '#34d399' : '#fbbf24' }}>
            ₹{Number(hasFreight ? rec.computed_net_return : rec.estimated_gross_value).toLocaleString()}
          </span>
          {hasFreight && (
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#8b949e' }}>
              Gross: ₹{Number(rec.estimated_gross_value).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 🚚 Smart Freight Logistics Card */}
      {hasFreight && (
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🚚</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#60a5fa', margin: 0 }}>
                Smart Freight Logistics (FarmOS Rate Model)
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label htmlFor="vehicle-select" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Vehicle:</label>
              <select
                id="vehicle-select"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <option value="mini_truck">Mini Truck (1T / Pickup)</option>
                <option value="small_truck">Small Truck (3T / Eicher)</option>
                <option value="medium_truck">Medium Truck (9T / 6-Wheeler)</option>
                <option value="large_truck">Heavy Truck (20T / Multi-Axle)</option>
              </select>
            </div>
          </div>

          <div className="logistics-metrics-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.8rem'
          }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Route Distance</span>
              <strong style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>{rec.estimated_distance}</strong>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Travel Time</span>
              <strong style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>
                {rec.travel_time_mins ? `~${rec.travel_time_mins} mins` : 'N/A'}
              </strong>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Vehicles Needed</span>
              <strong style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>
                {vehiclesRequired} x {vehicleConfig.name.split(' ')[0]}
              </strong>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Est. Freight Cost</span>
              <strong style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                ₹{rec.computed_freight !== null ? rec.computed_freight.toLocaleString() : 'N/A'}
              </strong>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Est. Net Return</span>
              <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>
                ₹{rec.computed_net_return !== null ? rec.computed_net_return.toLocaleString() : 'N/A'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Rationale Bullet Points */}
      {rec.why && rec.why.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: 'var(--text-primary, #f0f6fc)', display: 'block', marginBottom: '0.3rem' }}>
            Why FarmOS Recommends This Market:
          </strong>
          {rec.why.map((bullet, i) => (
            <div key={i} style={{ color: '#c9d1d9', marginBottom: '0.2rem', display: 'flex', gap: '0.4rem' }}>
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
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Mandi Market</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Modal Price</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Est. Gross</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Distance</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Est. Freight</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>Est. Net Return</th>
              <th style={{ padding: '0.6rem 0.75rem', color: '#8b949e' }}>FarmOS Score</th>
            </tr>
          </thead>
          <tbody>
            {comparisonList.slice(0, showDetails ? comparisonList.length : 5).map((item, idx) => {
              const isWinner = item.market === rec.market
              return (
                <tr key={idx} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  backgroundColor: isWinner ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  fontWeight: isWinner ? 700 : 400
                }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: isWinner ? '#fbbf24' : '#f0f6fc' }}>
                    {isWinner && '🏆 '}{item.market} ({item.district})
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#f59e0b' }}>
                    ₹{Number(item.modal_price).toLocaleString()}/qtl
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#f0f6fc' }}>
                    ₹{Number(item.estimated_gross_value).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#8b949e', fontStyle: 'italic' }}>
                    {item.estimated_distance}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: item.computed_freight ? '#f87171' : '#8b949e' }}>
                    {item.computed_freight !== null ? `₹${item.computed_freight.toLocaleString()}` : 'Not available'}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#34d399', fontWeight: 700 }}>
                    ₹{Number(item.computed_net_return).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span style={{
                      backgroundColor: isWinner ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                      color: isWinner ? '#fbbf24' : '#8b949e',
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
      {comparisonList.length > 5 && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.2rem 0',
            marginBottom: '0.8rem',
            textDecoration: 'underline'
          }}
        >
          {showDetails ? '▲ Show Top 5 Only' : `▼ View All ${comparisonList.length} Mandi Markets`}
        </button>
      )}

      {/* Warnings & Source Attribution Footer */}
      <div style={{
        fontSize: '0.76rem',
        color: '#8b949e',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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
        <div style={{ marginTop: '0.25rem', color: '#c9d1d9' }}>
          🏛️ <strong>Source:</strong> {data.data_source || 'Govt of India Agmarknet (data.gov.in)'} • 
          <span style={{ marginLeft: '0.4rem', fontStyle: 'italic' }}>
            Freight estimates use standard per-km transport rate models & road distance routing.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .market-comparison-card {
            padding: 1rem 0.75rem !important;
            border-radius: 12px !important;
          }
          .logistics-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 400px) {
          .logistics-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
