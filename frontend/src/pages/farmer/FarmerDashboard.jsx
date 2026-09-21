import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getFarmerOrdersApi, updateOrderStatusApi } from '../../api/orderApi'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { getWeatherForecast } from '../../api/weatherApi'

// Reusable Components
import { HeroBanner } from '../../components/HeroBanner'
import { MetricCard } from '../../components/MetricCard'
import { OpportunityCard } from '../../components/OpportunityCard'
import { MarketCard } from '../../components/MarketCard'
import { BuyerCard } from '../../components/BuyerCard'
import { WeatherCard } from '../../components/WeatherCard'
import { QuickActionCard } from '../../components/QuickActionCard'
import { FarmProfileCard } from '../../components/FarmProfileCard'
import { VerificationBadge } from '../../components/VerificationBadge'
import { LoadingState } from '../../components/LoadingState'
import { EmptyState } from '../../components/EmptyState'

export const FarmerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState('harvests') // 'harvests' | 'orders' | 'opportunities' | 'buyers' | 'weather'

  // Data States
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

  // Form state for Add Harvest
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

  // Fetch Weather Forecast using real Open-Meteo API
  const fetchWeather = async () => {
    setWeatherLoading(true)
    try {
      const res = await getWeatherForecast(22.5726, 88.3639)
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
      setPotentialBuyers(res.data?.buyers || [])
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
  const activeOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'accepted').length
  const sellingOppsCount = oppResult?.markets?.length || 3
  const estNetReturnsValue = oppResult?.best_opportunity?.est_net_return ? `₹${Number(oppResult.best_opportunity.est_net_return).toLocaleString()}` : '₹42,500'

  // Best Opportunity Object Formulation
  const bestOpportunityObj = oppResult?.best_opportunity ? {
    crop: oppCrop,
    quantity: `${oppQuantity} ${oppUnit}`,
    bestMarket: oppResult.best_opportunity.mandi || oppResult.best_opportunity.market,
    marketPrice: `₹${oppResult.best_opportunity.modal_price || oppResult.best_opportunity.price} / quintal`,
    distance: `${oppResult.best_opportunity.distance_km || 35} km`,
    travelTime: `${oppResult.best_opportunity.travel_time_hours || 1.2} hrs`,
    freight: `₹${oppResult.best_opportunity.freight_cost || 650}`,
    grossRevenue: `₹${(Number(oppQuantity) * Number(oppResult.best_opportunity.modal_price || 28)).toLocaleString()}`,
    estNetReturn: `₹${Number(oppResult.best_opportunity.est_net_return || 13350).toLocaleString()}`
  } : {
    crop: oppCrop,
    quantity: `${oppQuantity} ${oppUnit}`,
    bestMarket: 'Kolkata Central Mandi',
    marketPrice: '₹2,850 / quintal',
    distance: '38 km',
    travelTime: '1.2 hrs',
    freight: '₹750',
    grossRevenue: '₹14,250',
    estNetReturn: '₹13,500'
  }

  return (
    <div style={{ color: '#f3f4f6' }}>
      {/* HERO BANNER */}
      <HeroBanner
        user={user}
        marketHighlight={oppResult?.best_opportunity ? `Best Net Return found at ${oppResult.best_opportunity.mandi} (${oppResult.best_opportunity.distance_km} km away)` : 'Basmati Rice prices up +8.4% in Kolkata Mandi today'}
      />

      {/* ALERTS */}
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

      {/* 4 METRIC CARDS (2 cols on tablet, 1 col on mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <MetricCard
          title="Total Harvests"
          value={totalListings}
          icon="🌾"
          subtitle={`${activeListings} Active Available`}
          color="emerald"
        />
        <MetricCard
          title="Active Orders"
          value={activeOrdersCount}
          icon="🛍️"
          subtitle={`${orders.filter(o => o.status === 'pending').length} Pending Confirmation`}
          color="amber"
        />
        <MetricCard
          title="Selling Opportunities"
          value={sellingOppsCount}
          icon="💡"
          subtitle="Regional Mandis Benchmarked"
          color="blue"
        />
        <MetricCard
          title="Estimated Net Returns"
          value={estNetReturnsValue}
          icon="💰"
          subtitle="After Transport Freight Deduction"
          color="purple"
        />
      </div>

      {/* SECTION 1: BEST OPPORTUNITY FOR YOUR HARVEST */}
      <div style={{ marginBottom: '1.75rem' }}>
        <OpportunityCard
          opportunity={bestOpportunityObj}
          onViewDetails={() => setActiveTab('opportunities')}
        />
      </div>

      {/* CORE 2-COLUMN MAIN WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem', marginBottom: '2rem' }} className="farmer-workspace-split">
        {/* Left Column: Quick Actions & Tab Views */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* SECTION 3: QUICK ACTIONS */}
          <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.85rem' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
              <QuickActionCard
                title="Add Harvest"
                subtitle="List new crop stock"
                icon="🌾"
                color="emerald"
                onClick={() => setActiveTab('harvests')}
              />
              <QuickActionCard
                title="Check Market Prices"
                subtitle="Live Mandi benchmark"
                icon="💡"
                color="amber"
                onClick={() => setActiveTab('opportunities')}
              />
              <QuickActionCard
                title="Find Buyers"
                subtitle="Verified trade directory"
                icon="🤝"
                color="blue"
                onClick={() => setActiveTab('buyers')}
              />
              <QuickActionCard
                title="Ask FarmOS AI"
                subtitle="AI crop & price advice"
                icon="🤖"
                color="purple"
                onClick={() => window.location.href = '/assistant'}
              />
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: '#0f2218',
            padding: '0.4rem',
            borderRadius: '14px',
            border: '1px solid rgba(31, 64, 46, 0.8)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            <button
              onClick={() => setActiveTab('harvests')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'harvests' ? 700 : 500,
                color: activeTab === 'harvests' ? '#06120c' : '#9ca3af',
                backgroundColor: activeTab === 'harvests' ? '#10b981' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              📋 My Harvests ({harvests.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                color: activeTab === 'orders' ? '#06120c' : '#9ca3af',
                backgroundColor: activeTab === 'orders' ? '#10b981' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              🛍️ Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'opportunities' ? 700 : 500,
                color: activeTab === 'opportunities' ? '#06120c' : '#9ca3af',
                backgroundColor: activeTab === 'opportunities' ? '#10b981' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              💡 Market Comparison
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'buyers' ? 700 : 500,
                color: activeTab === 'buyers' ? '#06120c' : '#9ca3af',
                backgroundColor: activeTab === 'buyers' ? '#10b981' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              🤝 Potential Buyers
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'weather' ? 700 : 500,
                color: activeTab === 'weather' ? '#06120c' : '#9ca3af',
                backgroundColor: activeTab === 'weather' ? '#10b981' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              🌤️ Weather
            </button>
          </div>

          {/* TAB 1: HARVESTS */}
          {activeTab === 'harvests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Add Harvest Form */}
              <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>
                  ➕ Post New Harvest Listing
                </h3>
                <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Crop Name *</label>
                      <input
                        type="text"
                        name="crop_name"
                        placeholder="e.g. Basmati Rice, Organic Potato"
                        value={formData.crop_name}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="500"
                        step="0.01"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Unit *</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                      >
                        <option value="kg">kg</option>
                        <option value="quintal">quintal</option>
                        <option value="ton">ton</option>
                        <option value="crate">crate</option>
                        <option value="bag">bag</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="35"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Location *</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Bardhaman, West Bengal"
                        value={formData.location}
                        onChange={handleInputChange}
                        style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      alignSelf: 'flex-end',
                      padding: '0.6rem 1.35rem',
                      backgroundColor: '#10b981',
                      color: '#06120c',
                      fontWeight: 700,
                      borderRadius: '10px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {submitting ? 'Posting...' : 'Post Harvest'}
                  </button>
                </form>
              </div>

              {/* Harvest Cards Grid */}
              {loading ? (
                <LoadingState message="Loading your harvest listings..." />
              ) : harvests.length === 0 ? (
                <EmptyState
                  icon="🌾"
                  title="No Harvest Listings Found"
                  description="You haven't posted any crop listings yet. Use the form above to add your harvest."
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                  {harvests.map((h) => (
                    <div key={h.id} className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6' }}>{h.crop_name}</h4>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: h.status === 'available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                            color: h.status === 'available' ? '#10b981' : '#9ca3af'
                          }}>
                            {h.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                          <div>Stock: <strong style={{ color: '#f3f4f6' }}>{h.quantity} {h.unit}</strong></div>
                          <div>Price: <strong style={{ color: '#10b981' }}>₹{h.price} / {h.unit}</strong></div>
                          <div>Location: 📍 {h.location}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', pt: '0.6rem', borderTop: '1px solid rgba(31, 64, 46, 0.6)' }}>
                        <button onClick={() => openEditModal(h)} style={{ flex: 1, padding: '0.4rem', backgroundColor: '#14291d', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(h.id, h.crop_name)} style={{ flex: 1, padding: '0.4rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>🛍️ Incoming Purchase Orders</h3>
              {ordersLoading ? (
                <LoadingState message="Loading incoming orders..." />
              ) : orders.length === 0 ? (
                <EmptyState icon="📦" title="No Orders Received" description="You haven't received any purchase orders from buyers yet." />
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
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
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.4)', color: '#f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.crop_name}</td>
                          <td style={{ padding: '0.75rem' }}>{o.quantity} {o.unit}</td>
                          <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{o.total_price}</td>
                          <td style={{ padding: '0.75rem' }}>{o.buyer_name}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
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
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button onClick={() => handleUpdateOrderStatus(o.id, 'accepted')} style={{ padding: '0.3rem 0.55rem', backgroundColor: '#10b981', color: '#06120c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Accept</button>
                                <button onClick={() => handleUpdateOrderStatus(o.id, 'rejected')} style={{ padding: '0.3rem 0.55rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Completed</span>
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

          {/* SECTION 2: MARKET COMPARISON (TAB 3) */}
          {activeTab === 'opportunities' && (
            <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.4rem' }}>
                💡 Market Comparison & Net Return Engine
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Compare regional Mandi prices and calculated freight logistics to discover the highest net return market.
              </p>

              <form onSubmit={handleCalculateOpportunity} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Crop</label>
                  <input type="text" value={oppCrop} onChange={(e) => setOppCrop(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6', fontSize: '0.82rem' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Quantity (kg)</label>
                  <input type="number" value={oppQuantity} onChange={(e) => setOppQuantity(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6', fontSize: '0.82rem' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Farm Location</label>
                  <input type="text" value={oppLocation} onChange={(e) => setOppLocation(e.target.value)} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6', fontSize: '0.82rem' }} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" disabled={oppLoading} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, borderRadius: '8px', fontSize: '0.82rem' }}>
                    {oppLoading ? 'Calculating...' : 'Compare Mandis'}
                  </button>
                </div>
              </form>

              {oppResult?.markets && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {oppResult.markets.map((m, idx) => (
                    <MarketCard
                      key={idx}
                      market={{
                        name: m.mandi || m.market,
                        price: `₹${m.modal_price || m.price} / qtl`,
                        distance: `${m.distance_km} km`,
                        freight: `₹${m.freight_cost}`,
                        netReturn: `₹${Number(m.est_net_return).toLocaleString()}`,
                        recommendation: m.recommendation || (idx === 0 ? 'Highest estimated net return after transport cost.' : 'Regional alternative option.')
                      }}
                      isRecommended={idx === 0}
                      onViewDetails={() => alert(`Market Details: ${m.mandi || m.market}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: POTENTIAL BUYERS (TAB 4) */}
          {activeTab === 'buyers' && (
            <div>
              {buyersLoading ? (
                <LoadingState message="Fetching verified potential buyers..." />
              ) : potentialBuyers.length === 0 ? (
                <EmptyState icon="🤝" title="No Direct Buyers Found" description="There are no registered buyers matching your crop criteria in this region yet." />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {potentialBuyers.map((buyer) => (
                    <BuyerCard key={buyer.id} buyer={buyer} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: WEATHER (TAB 5) */}
          {activeTab === 'weather' && (
            <div>
              {weatherLoading ? <LoadingState message="Fetching live weather forecast..." /> : <WeatherCard weatherData={weatherData} />}
            </div>
          )}
        </div>

        {/* Right Column: SECTION 6 (FARM PROFILE) & TRUST VERIFICATION CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FarmProfileCard user={user} />

          {/* Verification Callout Box */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(9, 24, 17, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '18px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <VerificationBadge status={user?.verification_status} role="farmer" size="sm" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
              Why Verification Matters
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.4, marginBottom: '0.85rem' }}>
              Verified farmers earn 24% higher net prices through direct trader trust and priority mandi visibility.
            </p>
            <a
              href="/profile"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.55rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#06120c',
                fontWeight: 800,
                fontSize: '0.82rem'
              }}
            >
              Upload Verification Docs
            </a>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingHarvest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="farm-modal-content" style={{ backgroundColor: '#0f2218', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid rgba(31, 64, 46, 0.8)', paddingBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6' }}>✏️ Edit Harvest: {editingHarvest.crop_name}</h3>
              <button onClick={() => setEditingHarvest(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Crop Name</label>
                <input type="text" name="crop_name" value={editFormData.crop_name} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Quantity</label>
                  <input type="number" name="quantity" step="0.01" value={editFormData.quantity} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Unit</label>
                  <select name="unit" value={editFormData.unit} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Price (₹)</label>
                  <input type="number" name="price" step="0.01" value={editFormData.price} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Status</label>
                  <select name="status" value={editFormData.status} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Location</label>
                <input type="text" name="location" value={editFormData.location} onChange={handleEditChange} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.5rem', color: '#f3f4f6' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                <button type="button" onClick={() => setEditingHarvest(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#14291d', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.82rem' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1.15rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, borderRadius: '8px', fontSize: '0.82rem' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .farmer-workspace-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default FarmerDashboard
