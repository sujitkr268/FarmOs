import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getFarmerOrdersApi, updateOrderStatusApi } from '../../api/orderApi'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { MarketAnalyticsSection } from '../../components/analytics/MarketAnalyticsSection'

// UI Reusable Components
import { OpportunityCard } from '../../components/ui/OpportunityCard'
import { PotentialBuyersCard } from '../../components/PotentialBuyersCard'
import { LoadingState } from '../../components/ui/LoadingState'

import './farmer.css'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab) // 'overview' | 'harvests' | 'orders' | 'opportunities' | 'buyers' | 'analytics' | 'new_harvest'

  // Harvest states
  const [harvests, setHarvests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

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

  // Sync state with URL search param
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams({ tab: newTab })
  }

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

  // Handle Order Accept / Reject
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    setError('')
    setSuccess('')
    try {
      await updateOrderStatusApi(orderId, newStatus)
      setSuccess(`🎉 Order #${orderId} successfully ${newStatus}!`)
      fetchOrders()
      fetchHarvests()
    } catch (err) {
      console.error('Update Order Status Error:', err)
      setError(err.response?.data?.message || `Failed to ${newStatus} order.`)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Handle Harvest Delete
  const handleDeleteHarvest = async (harvestId) => {
    if (!window.confirm('Are you sure you want to remove this harvest listing?')) return
    setError('')
    setSuccess('')
    try {
      await API.delete(`/harvests/${harvestId}`)
      setSuccess('🌾 Harvest listing removed successfully.')
      fetchHarvests()
    } catch (err) {
      console.error('Delete Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to delete harvest listing.')
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
      const res = await API.get('/buyers')
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
        crop_name: 'Potato',
        quantity: '2000',
        unit: 'kg',
        grade: 'FAQ Grade',
        price: '1850',
        location: user?.location || '',
        description: '',
        availability: 'Available Now'
      })
      fetchHarvests()
      handleTabChange('harvests')
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
    estimated_freight_cost: null,
    estimated_net_return: 37000,
    estimated_distance: null,
    travel_time_mins: null
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
        marginBottom: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {t('farmer.goodMorning', { name: user?.name || 'Farmer' })} 🌾
            </h1>
            <TrustBadge status={user?.verification_status} role="farmer" size="md" />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.3rem 0 0 0', fontWeight: 500 }}>
            {t('farmer.dailySub')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleTabChange('new_harvest')}
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
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            🌾 Post New Harvest
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        backgroundColor: '#ffffff',
        padding: '0.35rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.75rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {[
          { id: 'overview', label: `🏠 ${t('nav.dashboard')}` },
          { id: 'harvests', label: `🌾 My Harvests (${harvests.length})` },
          { id: 'orders', label: `📦 Received Orders (${orders.length})` },
          { id: 'opportunities', label: `⭐ Market Opportunities` },
          { id: 'buyers', label: `🤝 Buyer Matches (${potentialBuyers.length})` },
          { id: 'analytics', label: `📊 Market Analytics` },
          { id: 'new_harvest', label: `🌱 Post Produce` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#ffffff' : '#64748b',
              backgroundColor: activeTab === tab.id ? '#10b981' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Top Summary Row: HARVEST SUMMARY & CURRENT MARKET PRICE */}
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
                  {harvests.length > 0 ? `${harvests.length} Active Listing(s)` : 'No Active Listings'}
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
                  <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>📅 Status</span>
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
                    / quintal (₹{(Number(bestOpp.modal_price || 1850) / 100).toFixed(2)}/kg)
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '0.25rem 0.55rem', borderRadius: '8px' }}>
                  📈 Benchmark Rate
                </span>
              </div>

              <div style={{ fontSize: '0.83rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem' }}>
                <span>📍 Market: <strong style={{ color: '#0f172a' }}>{bestOpp.market || 'Hooghly Mandi'}</strong></span>
                <span>📅 Updated: <strong style={{ color: '#0f172a' }}>Today</strong></span>
              </div>
            </div>
          </div>

          {/* BEST OPPORTUNITY CARD */}
          <OpportunityCard
            data={oppResult}
            onViewClick={() => handleTabChange('opportunities')}
          />

          {/* MARKET ANALYTICS PREVIEW */}
          <MarketAnalyticsSection
            opportunityData={oppResult}
            cropName={oppCrop}
            quantity={oppQuantity}
            unit={oppUnit}
          />
        </div>
      )}

      {/* TAB 2: MY HARVESTS */}
      {activeTab === 'harvests' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌾 My Registered Produce ({harvests.length})
              </h2>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Manage your active harvest listings available to verified buyers.
              </span>
            </div>
            <button
              onClick={() => handleTabChange('new_harvest')}
              style={{
                padding: '0.6rem 1.1rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Register New Produce
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading your registered harvests..." />
          ) : harvests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🌱</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                No active produce registered yet
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.2rem' }}>
                Register your harvest to receive buyer matches and calculated market opportunities.
              </p>
              <button
                onClick={() => handleTabChange('new_harvest')}
                style={{ padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer' }}
              >
                Register Harvest Produce Now
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Commodity</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Quantity</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Quality / Grade</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Expected Price</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Location</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {harvests.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        🌾 {item.crop_name}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        {Number(item.quantity).toLocaleString()} {item.unit || 'kg'}
                      </td>
                      <td style={{ padding: '1rem', color: '#15803d', fontWeight: 600 }}>
                        🏷 {item.grade || 'FAQ Grade'}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#10b981' }}>
                        ₹{Number(item.price || 0).toLocaleString()} /{item.unit || 'kg'}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        📍 {item.location || 'West Bengal'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: item.status === 'available' ? '#dcfce7' : '#fee2e2',
                          color: item.status === 'available' ? '#15803d' : '#991b1b',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '12px'
                        }}>
                          {item.status === 'available' ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteHarvest(item.id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          🗑 Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECEIVED ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              📦 Purchase Orders Received ({orders.length})
            </h2>
            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Review orders submitted by verified buyers and accept or decline.
            </span>
          </div>

          {ordersLoading ? (
            <LoadingState message="Loading received purchase orders..." />
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📦</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                No purchase orders received yet
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                When buyers place purchase orders for your registered crops, they will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((ord) => {
                const isPending = ord.status === 'pending'
                const isAccepted = ord.status === 'accepted'
                const isRejected = ord.status === 'rejected'

                return (
                  <div key={ord.id} style={{
                    backgroundColor: isPending ? '#fffbebf' : isAccepted ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${isPending ? '#fde68a' : isAccepted ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                          Order #{ord.id} — 🌾 {ord.crop_name || 'Produce'}
                        </strong>
                        <span style={{
                          backgroundColor: isPending ? '#fef3c7' : isAccepted ? '#dcfce7' : '#fee2e2',
                          color: isPending ? '#d97706' : isAccepted ? '#15803d' : '#b91c1c',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          textTransform: 'uppercase'
                        }}>
                          {ord.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: '#334155', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>📦 Quantity: <strong>{Number(ord.quantity).toLocaleString()} {ord.unit || 'kg'}</strong></span>
                        <span>💰 Total Value: <strong style={{ color: '#10b981' }}>₹{Number(ord.total_price || 0).toLocaleString()}</strong></span>
                        <span>👤 Buyer: <strong>{ord.buyer_name || 'Verified Buyer'}</strong></span>
                        {ord.buyer_phone && (
                          <span>📞 Contact: <strong>{ord.buyer_phone}</strong></span>
                        )}
                        <span>📅 Date: {new Date(ord.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {isPending && (
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          disabled={updatingOrderId === ord.id}
                          onClick={() => handleOrderStatusUpdate(ord.id, 'accepted')}
                          style={{
                            padding: '0.55rem 1.1rem',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {updatingOrderId === ord.id ? 'Updating...' : '✓ Accept Order'}
                        </button>
                        <button
                          disabled={updatingOrderId === ord.id}
                          onClick={() => handleOrderStatusUpdate(ord.id, 'rejected')}
                          style={{
                            padding: '0.55rem 1.1rem',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ✕ Reject Order
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MARKET OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div>
          {/* Opportunity Search Bar */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              🔍 Calculate Custom Market Opportunity
            </h3>
            <form onSubmit={handleCalculateOpportunity} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Crop</label>
                <input type="text" value={oppCrop} onChange={(e) => setOppCrop(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Quantity</label>
                <input type="number" value={oppQuantity} onChange={(e) => setOppQuantity(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Location</label>
                <input type="text" value={oppLocation} onChange={(e) => setOppLocation(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <button type="submit" disabled={oppLoading} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                {oppLoading ? 'Calculating...' : '⚡ Evaluate Opportunity'}
              </button>
            </form>
          </div>

          <OpportunityCard data={oppResult} />
        </div>
      )}

      {/* TAB 5: BUYER MATCHES */}
      {activeTab === 'buyers' && (
        <PotentialBuyersCard buyers={potentialBuyers} />
      )}

      {/* TAB 6: MARKET ANALYTICS */}
      {activeTab === 'analytics' && (
        <MarketAnalyticsSection opportunityData={oppResult} cropName={oppCrop} quantity={oppQuantity} unit={oppUnit} />
      )}

      {/* TAB 7: POST NEW HARVEST */}
      {activeTab === 'new_harvest' && (
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
                Add harvest details to receive market opportunities and buyer matches.
              </span>
            </div>
          </div>

          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Commodity / Crop *</label>
              <select name="crop_name" value={formData.crop_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }} required>
                <option value="Potato">Potato (आलू / आलू)</option>
                <option value="Rice">Rice / Paddy (चावल / ধান)</option>
                <option value="Wheat">Wheat (गेहूं / গম)</option>
                <option value="Onion">Onion (प्याज / পেঁয়াজ)</option>
                <option value="Tomato">Tomato (टमाटर / টমেটো)</option>
                <option value="Mustard">Mustard (सरसों / সরষে)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Quantity & Unit *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" name="quantity" placeholder="2000" value={formData.quantity} onChange={handleInputChange} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }} required />
                <select name="unit" value={formData.unit} onChange={handleInputChange} style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Quality / Grade *</label>
              <select name="grade" value={formData.grade} onChange={handleInputChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                <option value="FAQ Grade">FAQ Grade (Fair Average Quality)</option>
                <option value="Super Grade">Super Grade (Premium Market Fit)</option>
                <option value="Grade A">Grade A (Export / Processing Quality)</option>
                <option value="Standard Grade">Standard Grade</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Expected Price (₹ / unit)</label>
              <input type="number" name="price" placeholder="1850" value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={submitting} style={{ padding: '0.75rem 1.75rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                {submitting ? 'Posting...' : '🌾 Save & Register Produce'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export { FarmerDashboard }
export default FarmerDashboard
