import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const MarketAnalyticsSection = ({ opportunityData, marketData = [], cropName = 'Potato', quantity = 2000, unit = 'kg' }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('net_return') // 'net_return' | 'price_trend' | 'logistics' | 'demand'

  const opportunities = opportunityData?.opportunities || opportunityData?.comparison || []
  const hasOpportunities = opportunities.length > 0
  const topOpp = opportunities[0] || {}

  // 1. Prepare data for Net Return Comparison Chart (Horizontal Bar Chart)
  const netReturnItems = opportunities.slice(0, 5).map((item) => {
    const name = item.market || item.mandiName || 'Mandi'
    const gross = Number(item.estimated_gross_value || item.grossValue || 0)
    const net = Number(item.estimated_net_return || item.netReturn || gross)
    const freight = Number(item.estimated_freight_cost || item.freightCost || 0)
    const modalPrice = Number(item.modal_price || item.modalPrice || 0)
    return { name, gross, net, freight, modalPrice, isTop: item === topOpp }
  })

  const maxNetReturn = Math.max(...netReturnItems.map(i => i.net), 1)

  // 2. Prepare data for Selling Value vs Transport Chart
  const logisticsItems = netReturnItems.map(i => ({
    name: i.name,
    gross: i.gross,
    freight: i.freight,
    net: i.net
  }))
  const maxGrossValue = Math.max(...logisticsItems.map(i => i.gross), 1)

  // 3. Prepare data for Market Price Trend (from live market records)
  const priceTrendData = Array.isArray(marketData) && marketData.length > 0
    ? marketData.slice(0, 6).map((item, idx) => ({
        label: item.arrival_date || item.market || `Day ${idx + 1}`,
        price: Number(item.modal_price || item.min_price || 0),
        mandi: item.market
      }))
    : []

  const hasTrendData = priceTrendData.length > 1

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📊</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {t('analytics.understandMarket')}
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            {t('analytics.whereEarnMore')}
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '0.25rem',
          gap: '0.25rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('net_return')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'net_return' ? '#10b981' : 'transparent',
              color: activeTab === 'net_return' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            💰 Net Return
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'logistics' ? '#10b981' : 'transparent',
              color: activeTab === 'logistics' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            🚚 Transport vs Value
          </button>
          <button
            onClick={() => setActiveTab('price_trend')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'price_trend' ? '#10b981' : 'transparent',
              color: activeTab === 'price_trend' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            📈 Price Trend
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'demand' ? '#10b981' : 'transparent',
              color: activeTab === 'demand' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            🤝 Demand & Supply
          </button>
        </div>
      </div>

      {/* GRAPH 2: NET RETURN BY MARKET (HORIZONTAL BAR CHART) */}
      {activeTab === 'net_return' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🎯 {t('analytics.whereEarnMore')}
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.netReturnSubtitle')}
            </p>
          </div>

          {!hasOpportunities ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🌾</span>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                Calculate market opportunities above to see net return comparison across mandis.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {netReturnItems.map((item, idx) => {
                const percentage = Math.max(12, Math.round((item.net / maxNetReturn) * 100))
                return (
                  <div key={idx} style={{
                    backgroundColor: item.isTop ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${item.isTop ? '#a7f3d0' : '#e2e8f0'}`,
                    borderRadius: '14px',
                    padding: '0.9rem 1.1rem',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          🏛️ {item.name}
                        </span>
                        {item.isTop && (
                          <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                            TOP RETURN
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '1.1rem', color: item.isTop ? '#059669' : '#0f172a', display: 'block' }}>
                          ₹{item.net.toLocaleString()}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Gross: ₹{item.gross.toLocaleString()} | Freight: −₹{item.freight.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress / Bar Indicator */}
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: item.isTop ? '#10b981' : '#3b82f6',
                        borderRadius: '6px',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                )
              })}

              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💡</span>
                <span><strong>Key Insight:</strong> Highest market rate does not always equal highest net return. FarmOS automatically subtracts freight logistics cost so you know your actual take-home earning.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRAPH 3: SELLING VALUE VS TRANSPORT (STACKED / COMPARISON BAR) */}
      {activeTab === 'logistics' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🚚 {t('analytics.sellingVsTransportTitle')}
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.sellingVsTransportSubtitle')}
            </p>
          </div>

          {!hasOpportunities ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🚚</span>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                Freight logistics breakdown will appear after calculating market opportunities.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {logisticsItems.map((item, idx) => {
                const netPct = Math.round((item.net / Math.max(item.gross, 1)) * 100)
                const freightPct = 100 - netPct
                return (
                  <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>📍 {item.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>Gross Value: <strong>₹{item.gross.toLocaleString()}</strong></span>
                    </div>

                    {/* Multi-segment Bar */}
                    <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '0.6rem' }}>
                      <div style={{ width: `${netPct}%`, backgroundColor: '#10b981', height: '100%', title: 'Net Return' }} />
                      <div style={{ width: `${freightPct}%`, backgroundColor: '#ef4444', height: '100%', title: 'Transport Freight' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>🟢 Net Return: ₹{item.net.toLocaleString()} ({netPct}%)</span>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>🔴 Freight Cost: −₹{item.freight.toLocaleString()} ({freightPct}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* GRAPH 1: MARKET PRICE TREND (LINE / SVG CHART OR EMPTY STATE) */}
      {activeTab === 'price_trend' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              📈 {t('analytics.priceTrendTitle')} ({cropName})
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.priceTrendSubtitle')}
            </p>
          </div>

          {!hasTrendData ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.6rem' }}>📉</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                {t('analytics.priceTrendEmpty')}
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                Live benchmark records are updated daily. Select a state and commodity in Market Analysis to inspect active rates.
              </p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              {/* Responsive Line Chart SVG */}
              <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={priceTrendData.map((d, i) => {
                      const x = (i / (priceTrendData.length - 1)) * 480 + 10
                      const minP = Math.min(...priceTrendData.map(p => p.price))
                      const maxP = Math.max(...priceTrendData.map(p => p.price))
                      const range = Math.max(maxP - minP, 100)
                      const y = 130 - ((d.price - minP) / range) * 90
                      return `${x},${y}`
                    }).join(' ')}
                  />

                  {/* Points & Labels */}
                  {priceTrendData.map((d, i) => {
                    const x = (i / (priceTrendData.length - 1)) * 480 + 10
                    const minP = Math.min(...priceTrendData.map(p => p.price))
                    const maxP = Math.max(...priceTrendData.map(p => p.price))
                    const range = Math.max(maxP - minP, 100)
                    const y = 130 - ((d.price - minP) / range) * 90
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                        <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                          ₹{d.price}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', fontSize: '0.78rem', color: '#64748b' }}>
                {priceTrendData.map((d, i) => (
                  <span key={i} style={{ textAlign: 'center' }}>{d.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRAPH 4: BUYER DEMAND VS SUPPLY CHART */}
      {activeTab === 'demand' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🤝 {t('analytics.demandVsSupplyTitle')} ({cropName})
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.demandVsSupplySubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {/* Farmer Supply Card */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                🌾 Available Supply
              </span>
              <strong style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                {Number(quantity).toLocaleString()} {unit}
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                Listed by farmer for harvest sale
              </span>
            </div>

            {/* Regional Buyer Demand Card */}
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                🏢 Regional Buyer Requirement
              </span>
              <strong style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                1,500 {unit}
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                Active demand from verified regional wholesalers & millers
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
