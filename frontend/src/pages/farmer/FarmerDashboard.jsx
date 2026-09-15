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
    <div className="farmer-dashboard max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold">{t('farmer.welcomeBack')}, {user?.name}</h1>
            <TrustBadge status={user?.verification_status} role="farmer" size="md" />
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            📍 {user?.location || 'Location Not Specified'} • {user?.farm_size ? `Farm Size: ${user.farm_size}` : 'Farmer Account'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/profile"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold transition-colors"
          >
            👤 View Profile
          </a>
        </div>
      </div>

      {/* Global Alerts */}
      {error && <div className="alert-message alert-error mb-6 p-4 rounded-xl bg-red-50 text-red-800 border border-red-200">{error}</div>}
      {success && <div className="alert-message alert-success mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">{success}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">🌾</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">My Listings</span>
            <span className="text-2xl font-bold text-gray-900">{totalListings}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">✅</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Active Harvests</span>
            <span className="text-2xl font-bold text-emerald-600">{activeListings}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">🛍️</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Pending Orders</span>
            <span className="text-2xl font-bold text-amber-600">{pendingOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">🛡️</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Trust Verification</span>
            <div className="mt-0.5">
              <TrustBadge status={user?.verification_status} role="farmer" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('harvests')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'harvests'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📋 My Harvests ({harvests.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>🛍️ Received Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full">{pendingOrdersCount}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'opportunities'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          💡 Best Mandi Opportunities
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'buyers'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🤝 Potential Buyers ({potentialBuyers.length})
        </button>

        <button
          onClick={() => setActiveTab('weather')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'weather'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🌤️ Weather Forecast
        </button>
      </div>

      {/* TAB 1: MY HARVESTS */}
      {activeTab === 'harvests' && (
        <div className="space-y-8">
          {/* Post Harvest Form Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('farmer.postNewHarvest')}</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farmer.cropName')} *</label>
                  <input
                    type="text"
                    name="crop_name"
                    placeholder="e.g. Organic Wheat, Basmati Rice"
                    value={formData.crop_name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('common.quantity')} *</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="e.g. 500"
                    step="0.01"
                    min="0.1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farmer.unit')} *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farmer.pricePerUnit')} (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 35"
                    step="0.01"
                    min="0.1"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farmer.farmLocation')} *</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bardhaman, West Bengal"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farmer.harvestDesc')}</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Specify grade, moisture, variety..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
                >
                  {submitting ? t('farmer.posting') : t('farmer.postHarvestBtn')}
                </button>
              </div>
            </form>
          </div>

          {/* Harvests List Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">📋 {t('farmer.myHarvests')} ({harvests.length})</h3>
              <button onClick={fetchHarvests} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
            ) : harvests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500">
                <div className="text-4xl mb-2">🌾</div>
                <h4 className="text-base font-bold text-gray-800">{t('farmer.noHarvests')}</h4>
                <p className="text-sm mt-1">{t('farmer.noHarvestsDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {harvests.map((harvest) => (
                  <div key={harvest.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{harvest.crop_name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          harvest.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {harvest.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div>Quantity: <strong className="text-gray-900">{harvest.quantity} {harvest.unit}</strong></div>
                        <div>Price: <strong className="text-emerald-700">₹{harvest.price} / {harvest.unit}</strong></div>
                        <div>Location: 📍 {harvest.location}</div>
                      </div>
                      {harvest.description && <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mb-4">{harvest.description}</p>}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(harvest)}
                        className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(harvest.id, harvest.crop_name)}
                        className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-xs"
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

      {/* TAB 2: RECEIVED ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🛍️ Incoming Buyer Purchase Orders</h2>
          {ordersLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No purchase orders received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Crop Name</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Total Value</th>
                    <th className="p-3">Buyer Name</th>
                    <th className="p-3">Buyer Phone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold">#{o.id}</td>
                      <td className="p-3 font-semibold text-gray-900">{o.crop_name}</td>
                      <td className="p-3">{o.quantity} {o.unit}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{o.total_price}</td>
                      <td className="p-3">{o.buyer_name}</td>
                      <td className="p-3">{o.buyer_phone || 'Protected'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          o.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {o.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'accepted')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Processed</span>
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

      {/* TAB 3: BEST OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">💡 FarmOS Mandi Opportunity Engine</h2>
            <p className="text-sm text-gray-600 mb-4">Calculate net returns after freight logistics across major regional mandis.</p>

            <form onSubmit={handleCalculateOpportunity} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Crop</label>
                <input
                  type="text"
                  value={oppCrop}
                  onChange={(e) => setOppCrop(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={oppQuantity}
                  onChange={(e) => setOppQuantity(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={oppLocation}
                  onChange={(e) => setOppLocation(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={oppLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm"
                >
                  {oppLoading ? 'Calculating...' : 'Find Best Opportunity'}
                </button>
              </div>
            </form>

            {oppResult && <MarketComparison data={oppResult} />}
          </div>
        </div>
      )}

      {/* TAB 4: POTENTIAL BUYERS */}
      {activeTab === 'buyers' && (
        <div>
          {buyersLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : (
            <PotentialBuyersCard buyers={potentialBuyers} />
          )}
        </div>
      )}

      {/* TAB 5: WEATHER */}
      {activeTab === 'weather' && (
        <div>
          {weatherLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : (
            <WeatherCard weatherData={weatherData} />
          )}
        </div>
      )}

      {/* Modal: Edit Harvest */}
      {editingHarvest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">✏️ Edit Harvest: {editingHarvest.crop_name}</h3>
              <button onClick={() => setEditingHarvest(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  name="crop_name"
                  value={editFormData.crop_name}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    step="0.01"
                    value={editFormData.quantity}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={editFormData.unit}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="crate">crate</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price per Unit (₹)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHarvest(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export { FarmerDashboard }
export default FarmerDashboard
