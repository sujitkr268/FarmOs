import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getFarmerOrdersApi, updateOrderStatusApi } from '../../api/orderApi'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { MarketComparison } from '../../components/MarketComparison'
import { PotentialBuyersCard } from '../../components/PotentialBuyersCard'
import { WeatherCard } from '../../components/WeatherCard'
import { getWeatherForecast } from '../../api/weatherApi'
import './farmer.css'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState('harvests') // 'harvests' | 'orders' | 'opportunities' | 'buyers' | 'weather'

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
  const [oppCrop, setOppCrop] = useState('Rice')
  const [oppQuantity, setOppQuantity] = useState('500')
  const [oppUnit, setOppUnit] = useState('kg')
  const [oppLocation, setOppLocation] = useState(user?.location || 'Kolkata')
  const [oppLoading, setOppLoading] = useState(false)
  const [oppResult, setOppResult] = useState(null)

  // Weather state
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Potential Buyers state
  const [potentialBuyers, setPotentialBuyers] = useState([])
  const [buyersLoading, setBuyersLoading] = useState(false)

  // Form states for Add Harvest
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: user?.location || '',
    description: ''
  })

  // Edit Modal State
  const [editingHarvest, setEditingHarvest] = useState(null)
  const [editFormData, setEditFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    description: '',
    status: 'available'
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

  // Fetch Weather Forecast
  const fetchWeather = async () => {
    setWeatherLoading(true)
    try {
      const res = await getWeatherForecast(22.5726, 88.3639) // Default Kolkata / WB
      setWeatherData(res)
    } catch (err) {
      console.error('Fetch Weather Error:', err)
    } finally {
      setWeatherLoading(false)
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
      fetchWeather()
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
        location: formData.location || user?.location || 'Location Not Specified',
        description: formData.description
      })

      setSuccess('🌾 New harvest posted successfully!')
      setFormData({
        crop_name: '',
        quantity: '',
        unit: 'kg',
        price: '',
        location: user?.location || '',
        description: ''
      })
      fetchHarvests()
    } catch (err) {
      console.error('Create Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to create harvest listing.')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (harvest) => {
    setEditingHarvest(harvest)
    setEditFormData({
      crop_name: harvest.crop_name || '',
      quantity: harvest.quantity || '',
      unit: harvest.unit || 'kg',
      price: harvest.price || '',
      location: harvest.location || '',
      description: harvest.description || '',
      status: harvest.status || 'available'
    })
    setError('')
    setSuccess('')
  }

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await API.put(`/harvests/${editingHarvest.id}`, {
        crop_name: editFormData.crop_name,
        quantity: Number(editFormData.quantity),
        unit: editFormData.unit,
        price: Number(editFormData.price),
        location: editFormData.location,
        description: editFormData.description,
        status: editFormData.status
      })

      setSuccess(`Harvest "${editFormData.crop_name}" updated successfully!`)
      setEditingHarvest(null)
      fetchHarvests()
    } catch (err) {
      console.error('Update Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to update harvest.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, cropName) => {
    if (!window.confirm(`Are you sure you want to delete "${cropName}"?`)) return
    setError('')
    setSuccess('')
    try {
      await API.delete(`/harvests/${id}`)
      setSuccess(`Harvest "${cropName}" deleted.`)
      fetchHarvests()
    } catch (err) {
      console.error('Delete Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to delete harvest.')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus)
      setSuccess(`Order #${orderId} has been ${newStatus}.`)
      fetchOrders()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.')
    }
  }

  // Derived Overview Statistics
  const totalListings = harvests.length
  const activeListings = harvests.filter((h) => h.status === 'available').length
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length

  return (
    <div style={{ color: '#f3f4f6' }}>
      {/* 1. Welcome Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d2217 0%, #162a1e 50%, #0c1810 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '20px',
        padding: '1.75rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {t('farmer.welcomeBack')}, {user?.name} 👋
            </h1>
            <TrustBadge status={user?.verification_status} role="farmer" size="md" />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>📍 Location: <strong style={{ color: '#f3f4f6' }}>{user?.location || 'Location Not Specified'}</strong></span>
            <span>•</span>
            <span>🌱 Farm Size: <strong style={{ color: '#10b981' }}>{user?.farm_size || 'Standard'}</strong></span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/profile"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>👤</span> Profile & Verification
          </a>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ✅ {success}
        </div>
      )}

      {/* 2. Stat Metrics Grid (4 Columns) matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* Metric 1 */}
        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Active Harvests</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>
              🌾
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{activeListings}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
            <span>↑ {totalListings} Total Listed</span>
            <span style={{ color: '#6b7280' }}>• Available Now</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Pending Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>
              🛍️
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1.1 }}>{pendingOrdersCount}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
            <span>{orders.length} Total Orders Received</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Connected Buyers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>
              🤝
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{potentialBuyers.length}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>
            <span>Verified Trade Partners</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Trust Verification</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>
              🛡️
            </div>
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            <TrustBadge status={user?.verification_status} role="farmer" size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#a855f7', fontWeight: 600 }}>
            <span>{user?.verification_status === 'verified' ? 'Verified Account' : 'Action Required'}</span>
          </div>
        </div>
      </div>

      {/* 3. Core 2-Column Main Layout matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', marginBottom: '2rem' }} className="farmer-dashboard-split">
        {/* Left Column: Quick Actions & Main Workflows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 2x2 Quick Actions Card Grid */}
          <div style={{
            backgroundColor: '#111b15',
            border: '1px solid rgba(31, 56, 42, 0.8)',
            borderRadius: '18px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button onClick={() => setActiveTab('harvests')} className="quick-action-btn">
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  🌾
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Post Harvest</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>List new crop stock</div>
                </div>
              </button>

              <button onClick={() => setActiveTab('opportunities')} className="quick-action-btn">
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  💡
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Best Mandi Prices</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>Net return calculation</div>
                </div>
              </button>

              <button onClick={() => setActiveTab('buyers')} className="quick-action-btn">
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  🤝
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Find Direct Buyers</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>Verified trader list</div>
                </div>
              </button>

              <a href="/assistant" className="quick-action-btn">
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Ask AI Assistant</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>Crop & price advice</div>
                </div>
              </a>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: '#111b15',
            padding: '0.4rem',
            borderRadius: '14px',
            border: '1px solid rgba(31, 56, 42, 0.8)',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('harvests')}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'harvests' ? 700 : 500,
                color: activeTab === 'harvests' ? '#080e0a' : '#9ca3af',
                backgroundColor: activeTab === 'harvests' ? '#10b981' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              📋 My Harvests ({harvests.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                color: activeTab === 'orders' ? '#080e0a' : '#9ca3af',
                backgroundColor: activeTab === 'orders' ? '#10b981' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🛍️ Orders</span>
              {pendingOrdersCount > 0 && (
                <span style={{ backgroundColor: '#f59e0b', color: '#080e0a', borderRadius: '10px', padding: '0.1rem 0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'opportunities' ? 700 : 500,
                color: activeTab === 'opportunities' ? '#080e0a' : '#9ca3af',
                backgroundColor: activeTab === 'opportunities' ? '#10b981' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              💡 Opportunities
            </button>

            <button
              onClick={() => setActiveTab('buyers')}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'buyers' ? 700 : 500,
                color: activeTab === 'buyers' ? '#080e0a' : '#9ca3af',
                backgroundColor: activeTab === 'buyers' ? '#10b981' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              🤝 Buyers ({potentialBuyers.length})
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'weather' ? 700 : 500,
                color: activeTab === 'weather' ? '#080e0a' : '#9ca3af',
                backgroundColor: activeTab === 'weather' ? '#10b981' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              🌤️ Weather
            </button>
          </div>

          {/* TAB 1: MY HARVESTS */}
          {activeTab === 'harvests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Add Harvest Form */}
              <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>{t('farmer.postNewHarvest')}</h3>
                <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('farmer.cropName')} *</label>
                      <input
                        type="text"
                        name="crop_name"
                        placeholder="e.g. Organic Wheat, Basmati Rice"
                        value={formData.crop_name}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('common.quantity')} *</label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="e.g. 500"
                        step="0.01"
                        min="0.1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('farmer.unit')} *</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      >
                        <option value="kg">kg (Kilogram)</option>
                        <option value="quintal">quintal (100 kg)</option>
                        <option value="ton">ton (1000 kg)</option>
                        <option value="crate">crate</option>
                        <option value="bag">bag</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('farmer.pricePerUnit')} (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="e.g. 35"
                        step="0.01"
                        min="0.1"
                        value={formData.price}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('farmer.farmLocation')} *</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. Bardhaman, West Bengal"
                        value={formData.location}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.4rem' }}>{t('farmer.harvestDesc')}</label>
                      <input
                        type="text"
                        name="description"
                        placeholder="Grade, moisture, variety..."
                        value={formData.description}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: '#080e0a',
                        fontWeight: 700,
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
                      }}
                    >
                      {submitting ? t('farmer.posting') : t('farmer.postHarvestBtn')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Harvest Cards List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>📋 {t('farmer.myHarvests')} ({harvests.length})</h3>
                  <button onClick={fetchHarvests} style={{ padding: '0.35rem 0.75rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
                    🔄 Refresh
                  </button>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div>
                ) : harvests.length === 0 ? (
                  <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌾</div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{t('farmer.noHarvests')}</h4>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{t('farmer.noHarvestsDesc')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {harvests.map((harvest) => (
                      <div key={harvest.id} className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{harvest.crop_name}</h4>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: harvest.status === 'available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.2)',
                              color: harvest.status === 'available' ? '#10b981' : '#9ca3af',
                              border: harvest.status === 'available' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                            }}>
                              {harvest.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                            <div>Quantity: <strong style={{ color: '#f3f4f6' }}>{harvest.quantity} {harvest.unit}</strong></div>
                            <div>Price: <strong style={{ color: '#10b981' }}>₹{harvest.price} / {harvest.unit}</strong></div>
                            <div>Location: 📍 {harvest.location}</div>
                          </div>
                          {harvest.description && (
                            <p style={{ fontSize: '0.78rem', color: '#9ca3af', backgroundColor: '#0c140e', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                              {harvest.description}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(31, 56, 42, 0.8)' }}>
                          <button
                            onClick={() => openEditModal(harvest)}
                            style={{ flex: 1, padding: '0.45rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#f3f4f6', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(harvest.id, harvest.crop_name)}
                            style={{ flex: 1, padding: '0.45rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>🛍️ Incoming Purchase Orders</h3>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
                  <p>No purchase orders received yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.75rem' }}>Order ID</th>
                        <th style={{ padding: '0.75rem' }}>Crop</th>
                        <th style={{ padding: '0.75rem' }}>Quantity</th>
                        <th style={{ padding: '0.75rem' }}>Total Value</th>
                        <th style={{ padding: '0.75rem' }}>Buyer</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(31, 56, 42, 0.4)', color: '#f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.crop_name}</td>
                          <td style={{ padding: '0.75rem' }}>{o.quantity} {o.unit}</td>
                          <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{o.total_price}</td>
                          <td style={{ padding: '0.75rem' }}>{o.buyer_name}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: o.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : o.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: o.status === 'accepted' ? '#10b981' : o.status === 'rejected' ? '#ef4444' : '#f59e0b'
                            }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {o.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button onClick={() => handleUpdateOrderStatus(o.id, 'accepted')} style={{ padding: '0.3rem 0.65rem', backgroundColor: '#10b981', color: '#080e0a', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Accept</button>
                                <button onClick={() => handleUpdateOrderStatus(o.id, 'rejected')} style={{ padding: '0.3rem 0.65rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>💡 Mandi Net-Return Engine</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.25rem' }}>Calculate expected profits after deducting transport & freight charges across regional markets.</p>

              <form onSubmit={handleCalculateOpportunity} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Crop</label>
                  <input type="text" value={oppCrop} onChange={(e) => setOppCrop(e.target.value)} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Quantity (kg)</label>
                  <input type="number" value={oppQuantity} onChange={(e) => setOppQuantity(e.target.value)} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Farm Location</label>
                  <input type="text" value={oppLocation} onChange={(e) => setOppLocation(e.target.value)} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6', fontSize: '0.85rem' }} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" disabled={oppLoading} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>
                    {oppLoading ? 'Calculating...' : 'Find Mandis'}
                  </button>
                </div>
              </form>

              {oppResult && <MarketComparison data={oppResult} />}
            </div>
          )}

          {/* TAB 4: POTENTIAL BUYERS */}
          {activeTab === 'buyers' && (
            <div>
              {buyersLoading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div> : <PotentialBuyersCard buyers={potentialBuyers} />}
            </div>
          )}

          {/* TAB 5: WEATHER */}
          {activeTab === 'weather' && (
            <div>
              {weatherLoading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div> : <WeatherCard weatherData={weatherData} />}
            </div>
          )}
        </div>

        {/* Right Column: Profile Summary & Trust Callout Card matching screenshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Farm Business Overview Card */}
          <div style={{
            backgroundColor: '#111b15',
            border: '1px solid rgba(31, 56, 42, 0.8)',
            borderRadius: '18px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🌾 Farm Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(31, 56, 42, 0.6)' }}>
                <span style={{ color: '#9ca3af' }}>Farmer Name</span>
                <span style={{ color: '#f3f4f6', fontWeight: 700 }}>{user?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(31, 56, 42, 0.6)' }}>
                <span style={{ color: '#9ca3af' }}>Email</span>
                <span style={{ color: '#f3f4f6', fontWeight: 600 }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(31, 56, 42, 0.6)' }}>
                <span style={{ color: '#9ca3af' }}>Location</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>📍 {user?.location || 'Not Set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(31, 56, 42, 0.6)' }}>
                <span style={{ color: '#9ca3af' }}>Account Role</span>
                <span style={{ color: '#10b981', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>{user?.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '0.2rem' }}>
                <span style={{ color: '#9ca3af' }}>Verification</span>
                <TrustBadge status={user?.verification_status} role="farmer" size="sm" />
              </div>
            </div>
          </div>

          {/* "Why Verification Matters" Card matching screenshot */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(17, 27, 21, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '18px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#10b981', color: '#080e0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Why Verification Matters</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '1rem' }}>
              Verified farmers earn 24% higher prices on average through direct trade and instant trust badges.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: '#f3f4f6', marginBottom: '1.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> "FarmOS Verified" green badge on all crop listings
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Priority placement in Mandi & Buyer search results
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Direct purchase order requests from verified traders
              </li>
            </ul>

            <a
              href="/profile"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.65rem',
                borderRadius: '10px',
                backgroundColor: '#10b981',
                color: '#080e0a',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              Upload Verification Docs
            </a>
          </div>
        </div>
      </div>

      {/* Edit Harvest Modal */}
      {editingHarvest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(31, 56, 42, 0.8)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>✏️ Edit Harvest: {editingHarvest.crop_name}</h3>
              <button onClick={() => setEditingHarvest(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Crop Name</label>
                <input type="text" name="crop_name" value={editFormData.crop_name} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Quantity</label>
                  <input type="number" name="quantity" step="0.01" value={editFormData.quantity} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Unit</label>
                  <select name="unit" value={editFormData.unit} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }}>
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="crate">crate</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Price (₹)</label>
                  <input type="number" name="price" step="0.01" value={editFormData.price} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Status</label>
                  <select name="status" value={editFormData.status} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Location</label>
                <input type="text" name="location" value={editFormData.location} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingHarvest(null)} style={{ padding: '0.55rem 1.1rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: '0.55rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
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
