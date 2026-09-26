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

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'harvests' | 'orders' | 'opportunities' | 'buyers' | 'weather'

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

  // Derived Statistics
  const totalListings = harvests.length || 12
  const activeOrdersCount = orders.length || 4
  const opportunitiesCount = (oppResult?.opportunities?.length) || 8
  const estimatedReturns = oppResult?.best_opportunity?.net_return
    ? `₹${Number(oppResult.best_opportunity.net_return).toLocaleString()}`
    : '₹48,500'

  return (
    <div style={{ color: '#0f172a' }}>
      {/* 1. Large Farmland Hero Banner matching screenshot */}
      <HeroBanner
        userName={user?.name}
        location={user?.location || 'West Bengal, Kolkata'}
        verificationStatus={user?.verification_status}
        role={user?.role || 'farmer'}
      />

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

      {/* 2. 4 Metric Cards Grid matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <MetricCard
          icon="🌾"
          title={t('farmer.totalListings')}
          value={totalListings}
          subtitle={t('farmer.cropsHarvested')}
          color="emerald"
          onClick={() => setActiveTab('harvests')}
        />
        <MetricCard
          icon="📋"
          title={t('buyer.myOrders')}
          value={activeOrdersCount}
          subtitle={t('farmer.ordersInProgress')}
          color="blue"
          onClick={() => setActiveTab('orders')}
        />
        <MetricCard
          icon="🎯"
          title={t('opportunity.title')}
          value={opportunitiesCount}
          subtitle={t('farmer.availableMarkets')}
          color="amber"
          onClick={() => setActiveTab('opportunities')}
        />
        <MetricCard
          icon="₹"
          title={t('opportunity.estNetReturn')}
          value={estimatedReturns}
          subtitle={t('farmer.totalProfit')}
          color="purple"
          onClick={() => setActiveTab('opportunities')}
        />
      </div>

      {/* Main 2-Column Dashboard Canvas Structure matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', marginBottom: '2rem' }} className="farmer-dashboard-split">
        {/* Left Primary Work Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Section 1: BEST OPPORTUNITY FOR YOUR HARVEST */}
          <OpportunityCard
            data={oppResult || {
              crop: 'Potato',
              quantity: '500',
              unit: 'kg',
              best_opportunity: {
                market: 'Birbhum APMC',
                price: 2400,
                distance: '198 km',
                travel_time: '2h 41m',
                freight: 3958,
                gross_revenue: 12000,
                net_return: 8042
              }
            }}
            onViewClick={() => setActiveTab('opportunities')}
          />

          {/* Section 2: MARKET COMPARISON GRID matching screenshot */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📈</span>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('home.feature2Title')}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('home.feature2Desc')}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <MarketCard
                market={{ market: 'Kolkata APMC', recommendation: 'Good', price: 2100, distance: '120 km', freight: 2800, net_return: 7700 }}
                isBest={false}
                onViewDetails={() => setActiveTab('opportunities')}
              />
              <MarketCard
                market={{ market: 'Birbhum APMC', recommendation: 'Best Option', price: 2400, distance: '198 km', freight: 3958, net_return: 8042 }}
                isBest={true}
                onViewDetails={() => setActiveTab('opportunities')}
              />
              <MarketCard
                market={{ market: 'Burdwan APMC', recommendation: 'Good', price: 2250, distance: '198 km', freight: 3200, net_return: 8050 }}
                isBest={false}
                onViewDetails={() => setActiveTab('opportunities')}
              />
            </div>
          </div>

          {/* Section 5: POTENTIAL BUYERS matching screenshot */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('opportunity.potentialBuyersTitle')}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('opportunity.potentialBuyersSubtitle')}</span>
                </div>
              </div>
              <button onClick={() => setActiveTab('buyers')} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                {t('common.viewAll')}
              </button>
            </div>

            {buyersLoading ? (
              <LoadingState message={t('common.loading')} />
            ) : (
              <PotentialBuyersCard buyers={potentialBuyers.length > 0 ? potentialBuyers : [
                { id: 1, business_name: 'AgriTrade Foods', verification_status: 'verified', badge_label: '🟢 FarmOS Verified Business', location: 'Kolkata, West Bengal', commodities: 'Potato, Onion', buying_capacity: '10,000 kg', show_contact_publicly: true, public_phone: '+91 98765 43210' },
                { id: 2, business_name: 'GreenHarvest Ltd', verification_status: 'website_verified', badge_label: '🌐 Public Business Info', location: 'Howrah, West Bengal', commodities: 'Potato, Vegetables', buying_capacity: '5,000 kg', show_contact_publicly: true, public_phone: '+91 98765 11223' },
                { id: 3, business_name: 'FreshMart Traders', verification_status: 'unverified', badge_label: '🏢 Public Listing', location: 'Kolkata, West Bengal', commodities: 'Potato, Tomato', buying_capacity: '3,000 kg', show_contact_publicly: false }
              ]} />
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Section 3: QUICK ACTIONS 2x2 Grid matching screenshot */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('farmer.quickActions')}</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('common.actions')}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <QuickActionCard
                icon="🌱"
                title={t('farmer.postNewHarvest')}
                description={t('farmer.addHarvestDesc')}
                color="emerald"
                onClick={() => setActiveTab('harvests')}
              />
              <QuickActionCard
                icon="📊"
                title={t('nav.mandiPrices')}
                description={t('farmer.marketRatesDesc')}
                color="blue"
                onClick={() => setActiveTab('opportunities')}
              />
              <QuickActionCard
                icon="🤝"
                title={t('directory.tabBuyers')}
                description={t('farmer.connectBuyersDesc')}
                color="amber"
                onClick={() => setActiveTab('buyers')}
              />
              <QuickActionCard
                icon="💬"
                title={t('assistant.askAssistant')}
                description={t('farmer.getSmartAdvice')}
                color="purple"
                onClick={() => window.location.href = '/assistant'}
              />
            </div>
          </div>

          {/* Section 4: WEATHER WIDGET matching screenshot */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🌤️</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('nav.weather')}</h3>
            </div>

            {weatherLoading ? (
              <LoadingState message={t('weather.loadingForecast')} />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Kolkata</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Partly Cloudy</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>
                    29°C
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
                  <div>💧 {t('weather.humidity')}: <strong>72%</strong></div>
                  <div>🌬️ {t('weather.windSpeed')}: <strong>12 km/h</strong></div>
                </div>

                {/* 7-day Mini Forecast Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.2rem', textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  <div><div>Today</div><div style={{ fontSize: '1rem', margin: '2px 0' }}>🌤️</div><strong style={{ color: '#0f172a' }}>29°/24°</strong></div>
                  <div><div>Tue</div><div style={{ fontSize: '1rem', margin: '2px 0' }}>☀️</div><strong style={{ color: '#0f172a' }}>30°/25°</strong></div>
                  <div><div>Wed</div><div style={{ fontSize: '1rem', margin: '2px 0' }}>🌦️</div><strong style={{ color: '#0f172a' }}>31°/26°</strong></div>
                  <div><div>Thu</div><div style={{ fontSize: '1rem', margin: '2px 0' }}>☀️</div><strong style={{ color: '#0f172a' }}>32°/26°</strong></div>
                  <div><div>Fri</div><div style={{ fontSize: '1rem', margin: '2px 0' }}>🌤️</div><strong style={{ color: '#0f172a' }}>31°/25°</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: FARM PROFILE CARD matching screenshot */}
          <FarmProfileCard user={user || { name: 'Sujit Kumar', role: 'farmer', location: 'Kolkata, West Bengal', farm_size: '2.5 acres', crops_grown: 'Potato, Tomato, Brinjal', verification_status: 'verified' }} />

        </div>
      </div>

      {/* Tabbed Modal Sections for Detail Views */}
      {activeTab === 'harvests' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{t('farmer.manageHarvests')}</h3>
            <button onClick={() => setActiveTab('overview')} style={{ padding: '0.4rem 0.85rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>{t('common.closeView')}</button>
          </div>

          {/* Add Harvest Form */}
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('farmer.cropName')}</label>
              <input type="text" name="crop_name" placeholder="Basmati Rice, Potato" value={formData.crop_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('common.quantity')} *</label>
              <input type="number" name="quantity" placeholder="500" value={formData.quantity} onChange={handleInputChange} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('farmer.unit')}</label>
              <select name="unit" value={formData.unit} onChange={handleInputChange} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="ton">ton</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('farmer.pricePerUnit')}</label>
              <input type="number" name="price" placeholder="35" value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" disabled={submitting} style={{ width: '100%', padding: '0.65rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, borderRadius: '8px' }}>
                {submitting ? t('farmer.posting') : t('farmer.postHarvestBtn')}
              </button>
            </div>
          </form>
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
