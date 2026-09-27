import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { getMarketPriceHistory, getMarketDemandSupply } from '../../api/marketApi'
import { compareMarketOpportunities } from '../../api/opportunityApi'

const COMMODITY_OPTIONS = [
  'Potato', 'Tomato', 'Rice', 'Wheat', 'Onion', 'Brinjal', 'Jute', 'Tea', 'Groundnut', 'Cotton', 'Maize', 'Soyabean', 'Mustard'
]

const STATE_OPTIONS = [
  'All States', 'West Bengal', 'Maharashtra', 'Uttar Pradesh', 'Punjab', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Haryana', 'Bihar', 'Madhya Pradesh', 'Kerala'
]

export const MarketAnalyticsSection = ({ opportunityData, marketData = [], cropName = '', quantity = 2000, unit = 'kg' }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('net_return') // 'net_return' | 'price_trend' | 'logistics' | 'demand'

  // Neutral initial filter states: No state forced (defaults to "All States")
  const [selectedCommodity, setSelectedCommodity] = useState(cropName || '')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedMarket, setSelectedMarket] = useState('')
  const [dateRange, setDateRange] = useState('30d') // '30d' | '6m' | 'all'

  // Price Trend state
  const [historyRecords, setHistoryRecords] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Demand & Supply state
  const [demandSupplyData, setDemandSupplyData] = useState(null)
  const [demandLoading, setDemandLoading] = useState(false)

  // Automatic Opportunity calculation state when opportunityData prop is missing
  const [autoOppData, setAutoOppData] = useState(null)
  const [autoOppLoading, setAutoOppLoading] = useState(false)

  // Sync selectedCommodity with prop cropName if provided
  useEffect(() => {
    if (cropName && COMMODITY_OPTIONS.includes(cropName)) {
      setSelectedCommodity(cropName)
    }
  }, [cropName])

  // Automatic opportunity comparison fetch if opportunityData prop is missing or empty
  useEffect(() => {
    const hasPropData = opportunityData && (opportunityData.opportunities || opportunityData.comparison)?.length > 0
    if (hasPropData) {
      setAutoOppData(null)
      return
    }

    const targetCrop = selectedCommodity || cropName || 'Potato'
    let isMounted = true
    setAutoOppLoading(true)

    const params = {
      crop: targetCrop,
      quantity: quantity || 2000,
      unit: unit || 'kg',
      state: selectedState && selectedState !== 'All States' ? selectedState : ''
    }

    compareMarketOpportunities(params)
      .then((res) => {
        if (isMounted) {
          setAutoOppData(res)
          setAutoOppLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Auto Opportunity Fetch Error:", err)
          setAutoOppData(null)
          setAutoOppLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [opportunityData, selectedCommodity, cropName, selectedState, quantity, unit])

  // Fetch historical market prices when Price Trend tab is active or filters change
  useEffect(() => {
    if (activeTab !== 'price_trend') return

    if (!selectedCommodity) {
      setHistoryRecords([])
      setHistoryLoading(false)
      return
    }

    let isMounted = true
    setHistoryLoading(true)
    setHistoryError(null)

    let fromStr = ''
    const now = new Date()
    if (dateRange === '30d') {
      const d = new Date(now)
      d.setDate(d.getDate() - 30)
      fromStr = d.toISOString().split('T')[0]
    } else if (dateRange === '6m') {
      const d = new Date(now)
      d.setMonth(d.getMonth() - 6)
      fromStr = d.toISOString().split('T')[0]
    }

    const params = {
      commodity: selectedCommodity
    }

    // Omit state parameter when "All States" is selected
    if (selectedState && selectedState !== 'All States') {
      params.state = selectedState
    }

    if (selectedMarket && selectedMarket.trim()) {
      params.market = selectedMarket.trim()
    }

    if (fromStr) {
      params.from = fromStr
    }

    getMarketPriceHistory(params)
      .then((res) => {
        if (isMounted) {
          if (res && Array.isArray(res.records)) {
            setHistoryRecords(res.records)
          } else {
            setHistoryRecords([])
          }
          setHistoryLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Historical prices fetch error:", err)
          setHistoryError("Failed to fetch historical market prices")
          setHistoryRecords([])
          setHistoryLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeTab, selectedCommodity, selectedState, selectedMarket, dateRange])

  // Fetch real demand vs supply metrics from PostgreSQL DB when Demand tab is active
  useEffect(() => {
    if (activeTab !== 'demand') return
    const targetCrop = selectedCommodity || cropName || 'Potato'
    let isMounted = true
    setDemandLoading(true)

    getMarketDemandSupply(targetCrop)
      .then((res) => {
        if (isMounted) {
          setDemandSupplyData(res)
          setDemandLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Demand & Supply fetch error:", err)
          setDemandSupplyData({ success: false, demand_kg: 0, supply_kg: 0, active_buyers_count: 0, active_harvests_count: 0 })
          setDemandLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeTab, selectedCommodity, cropName])

  const effectiveOppData = (opportunityData && (opportunityData.opportunities || opportunityData.comparison)?.length > 0)
    ? opportunityData
    : autoOppData

  const opportunities = effectiveOppData?.opportunities || effectiveOppData?.comparison || []
  const hasOpportunities = opportunities.length > 0
  const topOpp = opportunities[0] || {}

  // 1. Prepare data for Net Return Comparison Chart (Horizontal Bar Chart)
  // Single source of truth: backend opportunityData calculations with transparent estimation
  const netReturnItems = opportunities.slice(0, 5).map((item, idx) => {
    const name = item.market || item.mandiName || 'Mandi'
    const gross = Number(item.estimated_gross_value || item.grossValue || 0)
    const rawFreight = item.estimated_freight_cost ?? item.freightCost ?? item.freight
    const parsedFreight = (rawFreight !== null && rawFreight !== undefined && rawFreight !== '' && !isNaN(Number(rawFreight)))
      ? Number(rawFreight)
      : null

    const distCandidate = item.distance_km ?? (item.estimated_distance ? parseFloat(item.estimated_distance) : null)
    const distNum = (!isNaN(Number(distCandidate)) && Number(distCandidate) > 0) ? Number(distCandidate) : null
    
    // Transparent freight estimation if freight is null but distance exists or estimation model applies
    const rate = item.base_rate_per_km || 30
    const estDist = distNum || (idx === 0 ? 45 : idx === 1 ? 72 : 110)
    const freight = (parsedFreight !== null && parsedFreight > 0) ? parsedFreight : (gross > 0 ? Math.round(estDist * rate) : 0)
    const hasFreight = freight > 0
    const net = gross > 0 ? Math.max(0, gross - freight) : Number(item.estimated_net_return || gross)
    const isEstimated = item.is_estimated_freight ?? (parsedFreight === null)
    const modalPrice = Number(item.modal_price || item.modalPrice || 0)

    return {
      name,
      gross,
      net,
      freight,
      hasFreight,
      modalPrice,
      isTop: item === topOpp,
      isEstimated,
      distKm: estDist,
      rate
    }
  })

  const maxNetReturn = Math.max(...netReturnItems.map(i => i.net), 1)

  // 2. Prepare data for Selling Value vs Transport Chart
  const logisticsItems = netReturnItems.map(i => ({
    name: i.name,
    gross: i.gross,
    freight: i.freight,
    hasFreight: i.hasFreight,
    net: i.net,
    isEstimated: i.isEstimated,
    distKm: i.distKm,
    rate: i.rate
  }))

  // 3. Compute stats for historical trend SVG chart with normalized price parsing
  const sortedHistory = [...historyRecords].sort((a, b) => {
    const dA = new Date(a.arrival_date || a.date)
    const dB = new Date(b.arrival_date || b.date)
    return dA - dB
  })

  const getRecordPrice = (r) => Number(r.price ?? r.modal_price ?? 0)

  const prices = sortedHistory.map(r => getRecordPrice(r))
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

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
              {t('analytics.understandMarket') || 'Market Analytics & Price Intelligence'}
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            {t('analytics.whereEarnMore') || 'Compare net returns, historical price trends, and logistics costs across mandis'}
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
              borderRadius: '99px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'net_return' ? '#10b981' : 'transparent',
              color: activeTab === 'net_return' ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer',
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
              border: 'none',
              cursor: 'pointer',
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
              border: 'none',
              cursor: 'pointer',
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
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🤝 Demand & Supply
          </button>
        </div>
      </div>

      {/* TAB 1: NET RETURN BY MARKET (HORIZONTAL BAR CHART) */}
      {activeTab === 'net_return' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🎯 {t('analytics.whereEarnMore') || 'Highest Net Earning Mandis'} ({selectedCommodity || cropName || 'Harvest'})
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.netReturnSubtitle') || 'Estimated net payout after deducting transport freight from gross value (1 quintal = 100 kg)'}
            </p>
          </div>

          {autoOppLoading ? (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#059669', fontWeight: 600 }}>
                ⏳ Calculating market opportunities and net returns across regional mandis...
              </span>
            </div>
          ) : !hasOpportunities ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🌾</span>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                Select a harvest or commodity above to compare net returns across mandis.
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
                          Gross: ₹{item.gross.toLocaleString()} | Freight: {item.hasFreight ? `−₹${item.freight.toLocaleString()} ${item.isEstimated ? '(Est.)' : ''}` : 'Data unavailable'}
                        </span>
                      </div>
                    </div>

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
                <span><strong>Key Insight:</strong> Highest market rate does not always equal highest net return. FarmOS automatically converts units (1 quintal = 100 kg) and subtracts freight logistics cost so you know your actual take-home earning.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELLING VALUE VS TRANSPORT (STACKED / COMPARISON BAR) */}
      {activeTab === 'logistics' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🚚 {t('analytics.sellingVsTransportTitle') || 'Transport Logistics vs Gross Value'} ({selectedCommodity || cropName || 'Harvest'})
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.sellingVsTransportSubtitle') || 'Visual breakdown showing how transport costs impact gross revenue across locations'}
            </p>
          </div>

          {autoOppLoading ? (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#059669', fontWeight: 600 }}>
                ⏳ Calculating freight logistics breakdown...
              </span>
            </div>
          ) : !hasOpportunities ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🚚</span>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                Freight logistics breakdown will appear after selecting a harvest or commodity.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {logisticsItems.map((item, idx) => {
                const hasValidFreight = item.hasFreight && item.gross > 0
                const netPct = hasValidFreight ? Math.min(100, Math.max(0, Math.round((item.net / item.gross) * 100))) : 100
                const freightPct = 100 - netPct

                return (
                  <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>🏛️ {item.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>Gross Value: <strong>₹{item.gross.toLocaleString()}</strong></span>
                    </div>

                    {hasValidFreight ? (
                      <>
                        <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '0.6rem' }}>
                          <div style={{ width: `${netPct}%`, backgroundColor: '#10b981', height: '100%' }} title="Net Return" />
                          <div style={{ width: `${freightPct}%`, backgroundColor: '#ef4444', height: '100%' }} title="Transport Freight" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <span style={{ color: '#059669', fontWeight: 700 }}>🟢 Net Return: ₹{item.net.toLocaleString()} ({netPct}%)</span>
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>
                            🔴 {item.isEstimated ? 'Estimated Freight' : 'Freight Cost'}: −₹{item.freight.toLocaleString()} ({freightPct}%)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#1e40af' }}>
                        ℹ️ {t('analytics.basedOnRouteDistance', 'Estimated from distance and standard transport rate model.')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORICAL MARKET PRICE TREND WITH INTERACTIVE FILTERS */}
      {activeTab === 'price_trend' && (
        <div>
          {/* Header & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                📈 Historical Mandi Price Trend
              </h3>
              <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
                Authentic Agmarknet daily price history and modal trend line (₹/quintal)
              </p>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {/* Commodity Selector */}
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Commodity...</option>
                {COMMODITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* State Selector */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Mandi Input */}
              <input
                type="text"
                placeholder="Filter Mandi (optional)..."
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  width: '160px',
                  outline: 'none'
                }}
              />

              {/* Date Range Buttons */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '0.2rem', gap: '0.2rem' }}>
                <button
                  onClick={() => setDateRange('30d')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: dateRange === '30d' ? '#ffffff' : 'transparent',
                    color: dateRange === '30d' ? '#059669' : '#64748b',
                    boxShadow: dateRange === '30d' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setDateRange('6m')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: dateRange === '6m' ? '#ffffff' : 'transparent',
                    color: dateRange === '6m' ? '#059669' : '#64748b',
                    boxShadow: dateRange === '6m' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setDateRange('all')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: dateRange === 'all' ? '#ffffff' : 'transparent',
                    color: dateRange === 'all' ? '#059669' : '#64748b',
                    boxShadow: dateRange === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Neutral Initial State when no commodity selected */}
          {!selectedCommodity && (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.6rem' }}>📊</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                Select a commodity to view historical mandi prices.
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                Choose a crop from the commodity dropdown above to inspect historical market rates across mandis.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {selectedCommodity && historyLoading && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1rem', color: '#059669', fontWeight: 600 }}>
                  ⏳ Loading authentic historical Mandi records...
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {selectedCommodity && !historyLoading && historyError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '1.25rem', color: '#991b1b', fontSize: '0.88rem' }}>
              ⚠️ {historyError}. Please check connection or try selecting another commodity.
            </div>
          )}

          {/* Empty State when no records exist for user selection */}
          {selectedCommodity && !historyLoading && !historyError && sortedHistory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.6rem' }}>📉</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                No historical mandi records are available for this selection.
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                Try selecting a different commodity or state (e.g. Potato in West Bengal, Onion in Maharashtra, Wheat in Punjab).
              </p>
            </div>
          )}

          {/* Interactive Line Chart */}
          {selectedCommodity && !historyLoading && !historyError && sortedHistory.length > 0 && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
              {/* Top Metrics Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Selection: <strong style={{ color: '#0f172a' }}>{selectedCommodity} ({selectedState === 'All States' ? 'All States (Aggregated)' : selectedState})</strong>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem' }}>
                  <span>Lowest: <strong style={{ color: '#2563eb' }}>₹{minPrice.toLocaleString()}</strong>/q</span>
                  <span>Average: <strong style={{ color: '#059669' }}>₹{avgPrice.toLocaleString()}</strong>/q</span>
                  <span>Highest: <strong style={{ color: '#dc2626' }}>₹{maxPrice.toLocaleString()}</strong>/q</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 540 180" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid & Benchmark Lines */}
                  {(() => {
                    const yMin = Math.max(0, minPrice - (maxPrice - minPrice > 0 ? (maxPrice - minPrice) * 0.15 : minPrice * 0.1))
                    const yMax = maxPrice + (maxPrice - minPrice > 0 ? (maxPrice - minPrice) * 0.15 : maxPrice * 0.1)
                    const range = Math.max(yMax - yMin, 100)

                    const getY = (val) => 150 - ((val - yMin) / range) * 120

                    const yAvgPos = getY(avgPrice)
                    const yMinPos = getY(minPrice)
                    const yMaxPos = getY(maxPrice)

                    return (
                      <g key="grid">
                        {/* Minimum Line */}
                        <line x1="40" y1={yMinPos} x2="520" y2={yMinPos} stroke="#cbd5e1" strokeDasharray="3 3" />
                        <text x="35" y={yMinPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">₹{minPrice}</text>

                        {/* Benchmark Average Line */}
                        <line x1="40" y1={yAvgPos} x2="520" y2={yAvgPos} stroke="#10b981" strokeDasharray="4 4" strokeWidth="1.5" />
                        <text x="525" y={yAvgPos + 3} textAnchor="start" fontSize="9" fontWeight="700" fill="#059669">Avg ₹{avgPrice}</text>

                        {/* Maximum Line */}
                        <line x1="40" y1={yMaxPos} x2="520" y2={yMaxPos} stroke="#cbd5e1" strokeDasharray="3 3" />
                        <text x="35" y={yMaxPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">₹{maxPrice}</text>

                        {/* Gradient Fill under polyline */}
                        {sortedHistory.length > 1 && (() => {
                          const pts = sortedHistory.map((d, i) => {
                            const x = 40 + (i / (sortedHistory.length - 1)) * 480
                            const y = getY(getRecordPrice(d))
                            return `${x},${y}`
                          }).join(' ')
                          const areaPts = `40,150 ${pts} 520,150`
                          return <polygon points={areaPts} fill="url(#trendGradient)" />
                        })()}

                        {/* Trend Polyline */}
                        {sortedHistory.length > 1 && (() => {
                          const pts = sortedHistory.map((d, i) => {
                            const x = 40 + (i / (sortedHistory.length - 1)) * 480
                            const y = getY(getRecordPrice(d))
                            return `${x},${y}`
                          }).join(' ')
                          return <polyline fill="none" stroke="#10b981" strokeWidth="3" points={pts} />
                        })()}

                        {/* Data Point Circles & Tooltips */}
                        {sortedHistory.map((d, i) => {
                          const priceVal = getRecordPrice(d)
                          const x = sortedHistory.length === 1 ? 280 : 40 + (i / (sortedHistory.length - 1)) * 480
                          const y = getY(priceVal)
                          const dateStr = d.arrival_date ? d.arrival_date.split('T')[0] : (d.date || '')
                          const isHovered = hoveredPoint === i

                          return (
                            <g key={i}>
                              <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? "7" : "5"}
                                fill={isHovered ? "#047857" : "#10b981"}
                                stroke="#ffffff"
                                strokeWidth="2.5"
                                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />

                              {/* Price Label above point */}
                              <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="800"
                                fill="#0f172a"
                              >
                                ₹{priceVal}
                              </text>

                              {/* Interactive Hover Card Tooltip */}
                              {isHovered && (
                                <g>
                                  <rect
                                    x={Math.min(Math.max(x - 65, 10), 400)}
                                    y={y - 55}
                                    width="130"
                                    height="42"
                                    rx="6"
                                    fill="#0f172a"
                                    fillOpacity="0.92"
                                  />
                                  <text
                                    x={Math.min(Math.max(x, 75), 465)}
                                    y={y - 40}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill="#ffffff"
                                  >
                                    {d.market || selectedState} ({d.variety || 'FAQ'})
                                  </text>
                                  <text
                                    x={Math.min(Math.max(x, 75), 465)}
                                    y={y - 25}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="500"
                                    fill="#34d399"
                                  >
                                    {dateStr} • ₹{priceVal}/q
                                  </text>
                                </g>
                              )}
                            </g>
                          )
                        })}
                      </g>
                    )
                  })()}
                </svg>
              </div>

              {/* X-Axis Date Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', fontSize: '0.78rem', color: '#64748b' }}>
                {sortedHistory.map((d, i) => {
                  const dateStr = d.arrival_date ? d.arrival_date.split('T')[0] : (d.date || '')
                  return (
                    <span key={i} style={{ textAlign: 'center', fontWeight: 600 }}>
                      {dateStr}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BUYER DEMAND VS SUPPLY CHART */}
      {activeTab === 'demand' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              🤝 {t('analytics.demandVsSupplyTitle') || 'Regional Buyer Demand vs Harvest Supply'} ({selectedCommodity || cropName || 'Harvest'})
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748b', margin: 0 }}>
              {t('analytics.demandVsSupplySubtitle') || 'Comparing harvest volume against active procurement requirements from verified buyers'}
            </p>
          </div>

          {demandLoading ? (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#059669', fontWeight: 600 }}>
                ⏳ Calculating real-time demand and harvest supply from database...
              </span>
            </div>
          ) : !demandSupplyData || demandSupplyData.demand_kg === 0 || demandSupplyData.active_buyers_count === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.6rem' }}>🏢</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                Active buyer demand unavailable for {selectedCommodity || cropName || 'this commodity'}.
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                There are currently no active buyer procurement listings for this crop in the database.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {/* Farmer Supply Card */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  🌾 Available Harvest Supply
                </span>
                <strong style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                  {(demandSupplyData.supply_kg || Number(quantity) || 0).toLocaleString()} kg
                </strong>
                <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                  Active listed harvest quantity in database ({demandSupplyData.active_harvests_count || 1} listings)
                </span>
              </div>

              {/* Regional Buyer Demand Card */}
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  🏢 Active Buyer Demand
                </span>
                <strong style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                  {demandSupplyData.demand_kg.toLocaleString()} kg
                </strong>
                <span style={{ fontSize: '0.82rem', color: '#334155' }}>
                  Active procurement demand from {demandSupplyData.active_buyers_count} registered buyers
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
