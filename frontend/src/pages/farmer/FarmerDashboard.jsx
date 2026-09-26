import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getFarmerOrdersApi, updateOrderStatusApi } from '../../api/orderApi'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { MarketComparison } from '../../components/MarketComparison'
import { PotentialBuyersCard } from '../../components/PotentialBuyersCard'
import { MarketAnalyticsSection } from '../../components/analytics/MarketAnalyticsSection'
import { getWeatherForecast } from '../../api/weatherApi'

// UI Reusable Components
import { HeroBanner } from '../../components/ui/HeroBanner'
import { MetricCard } from '../../components/ui/MetricCard'
import { OpportunityCard } from '../../components/ui/OpportunityCard'
import { MarketCard } from '../../components/ui/MarketCard'
import { QuickActionCard } from '../../components/ui/QuickActionCard'
import { FarmProfileCard } from '../../components/ui/FarmProfileCard'
import { LoadingState } from '../../components/ui/LoadingState'
import { EmptyState } from '../../components/ui/EmptyState'

import './farmer.css'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'harvests' | 'orders' | 'opportunities' | 'buyers' | 'analytics'

  // Harvest states
  const [harvests, setHarvests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Opportunity state
  const [oppCrop, setOppCrop] = useState('Potato')
  const [oppQuantity, setOppQuantity] = useState('2000')
  const [oppUnit, setOppUnit] = useState('kg')
  const [oppQuality, setOppQuality] = useState('FAQ Grade')
  const [oppLocation, setOppLocation] = useState(user?.location || 'Kolkata, West Bengal')
  const [oppLoading, setOppLoading] = useState(false)
  const [oppResult, setOppResult] = useState(null)

  // Potential Buyers state
  const [potentialBuyers, setPotentialBuyers] = useState([])
  const [buyersLoading, setBuyersLoading] = useState(false)

  // Form states for Add Harvest (Crop Registration)
  const [formData, setFormData] = useState({
    crop_name: 'Potato',
    quantity: '2000',
    unit: 'kg',
    grade: 'FAQ Grade',
    price: '1850',
    location: user?.location || 'Hooghly, West Bengal',
    description: '',
    availability: 'Available Now'
  })

  // Fetch harvests for logged-in farmer
  const fetchHarvests = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await API.get('/harvests')
      const allHarvests = response.data?.harvests || []
      const farmerHarvests = allHarvests.filter(
        (h) => String(h.farmer_id) === String(user?.id)
      )
      setHarvests(farmerHarvests)
      if (farmerHarvests.length > 0) {
        const first = farmerHarvests[0]
        setOppCrop(first.crop_name || 'Potato')
        setOppQuantity(String(first.quantity || '2000'))
        setOppUnit(first.unit || 'kg')
        setOppQuality(first.grade || 'FAQ Grade')
      }
    } catch (err) {
      console.error('Fetch Harvests Error:', err)
      setError(err.response?.data?.message || 'Failed to load your harvests.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders received by farmer
  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await getFarmerOrdersApi()
      setOrders(res.orders || [])
    } catch (err) {
      console.error('Fetch Farmer Orders Error:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fetch opportunity calculations
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

  // Fetch Registered Potential Buyers
  const fetchBuyers = async () => {
    setBuyersLoading(true)
    try {
      const res = await API.get('/buyer-verification/buyers')
      const buyersList = res.data?.buyers || []
      setPotentialBuyers(buyersList)
    } catch (err) {
      console.error('Fetch Buyers Error:', err)
    } finally {
      setBuyersLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchHarvests()
      fetchOrders()
      handleCalculateOpportunity()
      fetchBuyers()
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await API.post('/harvests', {
        crop_name: formData.crop_name,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        price: Number(formData.price),
        grade: formData.grade,
        location: formData.location || user?.location || 'Location Not Specified',
        description: formData.description
      })

      setSuccess('🌾 New harvest posted successfully!')
      setFormData({
        crop_name: '',
        quantity: '',
        unit: 'kg',
        grade: 'FAQ Grade',
        price: '',
        location: user?.location || '',
        description: '',
        availability: 'Available Now'
      })
      fetchHarvests()
    } catch (err) {
      console.error('Create Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to create harvest listing.')
    } finally {
      setSubmitting(false)
    }
  }

  const bestOpp = oppResult?.best_opportunity || (oppResult?.opportunities && oppResult.opportunities[0]) || {
    market: 'Hooghly Mandi',
    modal_price: 1850,
    estimated_gross_value: 37000,
    estimated_freight_cost: 2400,
    estimated_net_return: 34600,
    estimated_distance: '45 km',
    travel_time_mins: 72
  }

  const activeHarvest = harvests[0] || {
    crop_name: oppCrop,
    quantity: oppQuantity,
    unit: oppUnit,
    grade: oppQuality,
    location: oppLocation
  }

  return (
    <div style={{ color: '#0f172a' }}>
      {/* 1. Farmer Daily Decision Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {t('farmer.goodMorning', { name: user?.name || 'Farmer' })}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.3rem 0 0 0', fontWeight: 500 }}>
            {t('farmer.dailySub')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('harvests')}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '12px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            🌾 Post New Harvest
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ✅ {success}
        </div>
      )}

      {/* 2. Top Summary Row: HARVEST SUMMARY & CURRENT MARKET PRICE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* HARVEST SUMMARY CARD */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('farmer.harvestSummary')}
            </span>
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
              Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>🌾 Crop</span>
              <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{activeHarvest.crop_name}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>📦 Quantity</span>
              <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{Number(activeHarvest.quantity).toLocaleString()} {activeHarvest.unit || 'kg'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>🏷 Quality / Grade</span>
              <strong style={{ color: '#15803d', fontSize: '0.92rem' }}>{activeHarvest.grade || 'FAQ Grade'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>📅 Availability</span>
              <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>Available Now</strong>
            </div>
          </div>
        </div>

        {/* CURRENT MARKET PRICE CARD */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('common.price')} ({activeHarvest.crop_name})
            </span>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
              Agmarknet Benchmark
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                ₹{Number(bestOpp.modal_price || 1850).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748b', marginLeft: '0.3rem' }}>
                / quintal
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '0.25rem 0.55rem', borderRadius: '8px' }}>
              📈 Stable Trend
            </span>
          </div>

          <div style={{ fontSize: '0.83rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem' }}>
            <span>📍 Market: <strong style={{ color: '#0f172a' }}>{bestOpp.market || 'Hooghly Mandi'}</strong></span>
            <span>📅 Updated: <strong style={{ color: '#0f172a' }}>Today</strong></span>
          </div>
        </div>
      </div>

      {/* 3. BEST OPPORTUNITY (MAIN VISUAL FOCUS) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #10b981',
        borderRadius: '22px',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.1)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>⭐</span>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {t('opportunity.yourOpportunity')}
              </h2>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                {t('opportunity.recommendedMarket')}: <strong style={{ color: '#059669' }}>{bestOpp.market || 'Hooghly Mandi'}</strong>
              </span>
            </div>
          </div>

          <span style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            RECOMMENDED BY FARMOS
          </span>
        </div>

        {/* Financial Numbers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.estGrossValue')}</span>
            <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>
              ₹{Number(bestOpp.estimated_gross_value || 37000).toLocaleString()}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600, display: 'block' }}>Freight Transport Cost</span>
            <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
              −₹{Number(bestOpp.estimated_freight_cost || 2400).toLocaleString()}
            </strong>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '0.65rem 0.9rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>{t('opportunity.estNetReturn')}</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
              ₹{Number(bestOpp.estimated_net_return || 34600).toLocaleString()}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.routeDistance')} & {t('opportunity.travelTime')}</span>
            <strong style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              🚗 {bestOpp.estimated_distance || '45 km'} (~{Math.round((bestOpp.travel_time_mins || 72) / 60 * 10) / 10} hrs)
            </strong>
          </div>
        </div>

        {/* WHY THIS OPPORTUNITY? Checkmark Rationale */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            {t('opportunity.whyThisOpp')}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 600 }}>
              <span>✓</span> {t('opportunity.reasonGoodPrice')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 600 }}>
              <span>✓</span> {t('opportunity.reasonLowerTransport')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 600 }}>
              <span>✓</span> {t('opportunity.reasonQuantityMatch')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 600 }}>
              <span>✓</span> {t('opportunity.reasonGradeMatch')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 600 }}>
              <span>✓</span> {t('opportunity.reasonBuyerDemand')}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            width: '100%',
            padding: '0.9rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            borderRadius: '14px',
            border: 'none',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
        >
          View Opportunity & Market Analytics →
        </button>
      </div>

      {/* 4. ANALYTICS SECTION ("Understand your market") */}
      <MarketAnalyticsSection
        opportunityData={oppResult}
        cropName={oppCrop}
        quantity={oppQuantity}
        unit={oppUnit}
      />

      {/* 5. CROP REGISTRATION SECTION */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🌱</span>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Register Harvest Produce
            </h3>
            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Add details to receive market opportunities and buyer matches.
            </span>
          </div>
        </div>

        {/* Crop Input Form */}
        <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Commodity / Crop *
            </label>
            <select
              name="crop_name"
              value={formData.crop_name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }}
              required
            >
              <option value="Potato">Potato (आलू / আলু)</option>
              <option value="Rice">Rice / Paddy (चावल / ধান)</option>
              <option value="Wheat">Wheat (गेहूं / গম)</option>
              <option value="Onion">Onion (प्याज / পেঁয়াজ)</option>
              <option value="Tomato">Tomato (टमाटर / টমেটো)</option>
              <option value="Mustard">Mustard (सरसों / সরষে)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Quantity & Unit *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="quantity"
                placeholder="2000"
                value={formData.quantity}
                onChange={handleInputChange}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
                required
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }}
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="ton">ton</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Quality / Grade *
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }}
            >
              <option value="FAQ Grade">FAQ Grade (Fair Average Quality)</option>
              <option value="Super Grade">Super Grade (Premium Market Fit)</option>
              <option value="Grade A">Grade A (Export / Processing Quality)</option>
              <option value="Standard Grade">Standard Grade</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Expected Price (₹ / unit)
            </label>
            <input
              type="number"
              name="price"
              placeholder="1850"
              value={formData.price}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                cursor: 'pointer'
              }}
            >
              {submitting ? 'Posting...' : '🌾 Save & Register Produce'}
            </button>
          </div>
        </form>

        {/* "Why quality matters" Explanation Box */}
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#166534', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#15803d' }}>
              {t('farmer.whyQualityMatters')}
            </strong>
            <span>{t('farmer.qualityExplanation')}</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .farmer-dashboard-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export { FarmerDashboard }
export default FarmerDashboard
