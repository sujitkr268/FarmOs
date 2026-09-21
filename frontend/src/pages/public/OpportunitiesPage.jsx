import React, { useState, useEffect } from 'react'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { OpportunityCard } from '../../components/OpportunityCard'
import { MarketCard } from '../../components/MarketCard'
import { LoadingState } from '../../components/LoadingState'
import { useAuth } from '../../context/AuthContext'

export const OpportunitiesPage = () => {
  const { user } = useAuth()
  const [oppCrop, setOppCrop] = useState('Basmati Rice')
  const [oppQuantity, setOppQuantity] = useState('1000')
  const [oppUnit, setOppUnit] = useState('kg')
  const [oppLocation, setOppLocation] = useState(user?.location || 'Bardhaman')
  const [oppLoading, setOppLoading] = useState(false)
  const [oppResult, setOppResult] = useState(null)

  const handleCalculateOpportunity = async (e) => {
    if (e) e.preventDefault()
    setOppLoading(true)
    try {
      const res = await compareMarketOpportunities({
        crop: oppCrop,
        commodity: oppCrop,
        quantity: oppQuantity,
        unit: oppUnit,
        farmer_location: oppLocation,
        location: oppLocation
      })
      setOppResult(res)
    } catch (err) {
      console.error('Fetch Opportunity Error:', err)
    } finally {
      setOppLoading(false)
    }
  }

  useEffect(() => {
    handleCalculateOpportunity()
  }, [])

  const bestOpportunityObj = oppResult?.best_opportunity ? {
    crop: oppCrop,
    quantity: `${oppQuantity} ${oppUnit}`,
    bestMarket: oppResult.best_opportunity.mandi || oppResult.best_opportunity.market,
    marketPrice: `₹${oppResult.best_opportunity.modal_price || oppResult.best_opportunity.price} / quintal`,
    distance: `${oppResult.best_opportunity.distance_km || 35} km`,
    travelTime: `${oppResult.best_opportunity.travel_time_hours || 1.2} hrs`,
    freight: `₹${oppResult.best_opportunity.freight_cost || 750}`,
    grossRevenue: `₹${(Number(oppQuantity) * Number(oppResult.best_opportunity.modal_price || 28)).toLocaleString()}`,
    estNetReturn: `₹${Number(oppResult.best_opportunity.est_net_return || 13500).toLocaleString()}`
  } : null

  return (
    <div style={{ color: '#f3f4f6', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 60%, #06120c 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        marginBottom: '1.75rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          💡 Mandi Net-Return & Freight Engine
        </h1>
        <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 600 }}>
          Compare real gross returns across regional APMC mandis after deducting road transport logistics freight costs.
        </p>
      </div>

      {/* Query Calculation Form */}
      <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>
          🔍 Enter Harvest Details for Comparison
        </h3>
        <form onSubmit={handleCalculateOpportunity} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Crop / Commodity</label>
            <input type="text" value={oppCrop} onChange={(e) => setOppCrop(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Quantity</label>
            <input type="number" value={oppQuantity} onChange={(e) => setOppQuantity(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Unit</label>
            <select value={oppUnit} onChange={(e) => setOppUnit(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }}>
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Farm Location</label>
            <input type="text" value={oppLocation} onChange={(e) => setOppLocation(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" disabled={oppLoading} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 800, borderRadius: '8px', fontSize: '0.85rem' }}>
              {oppLoading ? 'Calculating...' : 'Compare Markets'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Display */}
      {oppLoading ? (
        <LoadingState message="Calculating regional freight costs and mandi net returns..." />
      ) : (
        <>
          {bestOpportunityObj && (
            <div style={{ marginBottom: '1.75rem' }}>
              <OpportunityCard opportunity={bestOpportunityObj} onViewDetails={() => {}} />
            </div>
          )}

          {oppResult?.markets && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>
                📍 Regional Mandi Comparison Grid ({oppResult.markets.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {oppResult.markets.map((m, idx) => (
                  <MarketCard
                    key={idx}
                    market={{
                      name: m.mandi || m.market,
                      price: `₹${m.modal_price || m.price} / qtl`,
                      distance: `${m.distance_km} km`,
                      freight: `₹${m.freight_cost}`,
                      netReturn: `₹${Number(m.est_net_return).toLocaleString()}`,
                      recommendation: m.recommendation || (idx === 0 ? 'Recommended highest net return.' : 'Regional alternative mandi.')
                    }}
                    isRecommended={idx === 0}
                    onViewDetails={() => alert(`Selected Mandi: ${m.mandi || m.market}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OpportunitiesPage
