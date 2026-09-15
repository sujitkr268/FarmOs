import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getBuyerOrdersApi } from '../../api/orderApi'
import { MandiPrices } from '../../components/MandiPrices'
import { useNavigate } from 'react-router-dom'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'marketplace' | 'prices' | 'verification'

  // Orders State
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Produce Marketplace State
  const [harvests, setHarvests] = useState([])
  const [harvestsLoading, setHarvestsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Order Placement Modal State
  const [selectedHarvest, setSelectedHarvest] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState('1')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  // Fetch Buyer's placed orders
  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await getBuyerOrdersApi()
      setOrders(res.orders || [])
    } catch (err) {
      console.error('Fetch Buyer Orders Error:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fetch Available Marketplace Harvests
  const fetchMarketplace = async () => {
    setHarvestsLoading(true)
    try {
      const res = await API.get('/harvests')
      const available = (res.data?.harvests || []).filter(h => h.status === 'available')
      setHarvests(available)
    } catch (err) {
      console.error('Fetch Marketplace Error:', err)
    } finally {
      setHarvestsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchOrders()
      fetchMarketplace()
    }
  }, [user])

  const handleOpenOrderModal = (harvest) => {
    setSelectedHarvest(harvest)
    setOrderQuantity('1')
    setOrderError('')
    setOrderSuccess('')
  }

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault()
    setOrderError('')
    setOrderSuccess('')

    const qty = Number(orderQuantity)
    if (isNaN(qty) || qty <= 0) {
      setOrderError('Order quantity must be greater than zero.')
      return
    }

    if (qty > Number(selectedHarvest.quantity)) {
      setOrderError(`Requested quantity (${qty}) exceeds available stock (${selectedHarvest.quantity} ${selectedHarvest.unit}).`)
      return
    }

    setOrderSubmitting(true)
    try {
      await API.post('/orders', {
        harvest_id: selectedHarvest.id,
        quantity: qty
      })
      setOrderSuccess('🎉 Purchase order created successfully! Submitted to farmer for approval.')
      setSelectedHarvest(null)
      fetchOrders()
      fetchMarketplace()
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place purchase order.')
    } finally {
      setOrderSubmitting(false)
    }
  }

  const filteredHarvests = harvests.filter(h => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      h.crop_name?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q)
    )
  })

  // Derived Statistics
  const totalOrdersCount = orders.length
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length
  const acceptedOrdersCount = orders.filter(o => o.status === 'accepted').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold">{user?.business_name || user?.name}</h1>
            <TrustBadge status={user?.verification_status} role="buyer" size="md" />
          </div>
          <p className="text-sky-200 text-sm mt-1">
            📍 {user?.state ? `${user.state}, ${user.district || ''}` : user?.location || 'Location Not Specified'}
            {user?.mandi && ` • Primary Mandi: ${user.mandi}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/profile"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold transition-colors"
          >
            🏢 View Business Profile
          </a>
        </div>
      </div>

      {/* Global Alerts */}
      {orderSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex justify-between items-center">
          <span>{orderSuccess}</span>
          <button onClick={() => setOrderSuccess('')} className="font-bold text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl font-bold">📦</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Total Orders Placed</span>
            <span className="text-2xl font-bold text-gray-900">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">⏳</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Pending Approval</span>
            <span className="text-2xl font-bold text-amber-600">{pendingOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">✅</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Accepted Orders</span>
            <span className="text-2xl font-bold text-emerald-600">{acceptedOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">🛡️</div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Verification Status</span>
            <div className="mt-0.5">
              <TrustBadge status={user?.verification_status} role="buyer" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📦 My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'marketplace'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🌾 Browse Farmer Produce
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'prices'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📈 Mandi Price Directory
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'verification'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🛡️ Verification Credentials
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📦 Purchase Orders Placed</h2>
            <button onClick={fetchOrders} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
              🔄 Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🛒</div>
              <p className="font-semibold text-gray-700">No purchase orders placed yet.</p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl"
              >
                Browse Produce Marketplace
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Crop Name</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Farmer Contact</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold">#{o.id}</td>
                      <td className="p-3 font-semibold text-gray-900">{o.crop_name}</td>
                      <td className="p-3">{o.quantity} {o.unit}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{o.total_price}</td>
                      <td className="p-3">{o.farmer_name}</td>
                      <td className="p-3">{o.farmer_phone || 'Protected'}</td>
                      <td className="p-3">📍 {o.location}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          o.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BROWSE MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search produce by crop name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-hidden"
            />
            <button
              onClick={fetchMarketplace}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm"
            >
              Search
            </button>
          </div>

          {harvestsLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : filteredHarvests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500">
              <div className="text-4xl mb-2">🌾</div>
              <p>No available produce listings found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHarvests.map((h) => (
                <div key={h.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{h.crop_name}</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        Available
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div>Stock: <strong className="text-gray-900">{h.quantity} {h.unit}</strong></div>
                      <div>Price: <strong className="text-emerald-700 text-base">₹{h.price} / {h.unit}</strong></div>
                      <div>Farmer: <span className="font-medium text-gray-800">{h.farmer_name || 'Verified Farmer'}</span></div>
                      <div>Location: 📍 {h.location}</div>
                    </div>

                    {h.description && <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mb-4">{h.description}</p>}
                  </div>

                  <button
                    onClick={() => handleOpenOrderModal(h)}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
                  >
                    🛒 Place Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANDI PRICES */}
      {activeTab === 'prices' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <MandiPrices />
        </div>
      )}

      {/* TAB 4: VERIFICATION CREDENTIALS */}
      {activeTab === 'verification' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-2">🛡️ Buyer Verification Credentials</h2>
          <p className="text-sm text-gray-600 mb-6">
            FarmOS verified buyers receive lower platform fees, direct contact access with farmers, and trusted buyer badges.
          </p>

          <div className="mb-6">
            <TrustBadge status={user?.verification_status} role="buyer" size="lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block font-medium">e-NAM Reference ID</span>
              <span className="font-semibold text-gray-900 font-mono">{user?.enam_reference || 'Not provided'}</span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block font-medium">Udyam Registration Reference</span>
              <span className="font-semibold text-gray-900 font-mono">{user?.udyam_reference || 'Not provided'}</span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block font-medium">Official Website</span>
              <span className="font-semibold text-gray-900">
                {user?.official_website ? (
                  <a href={user.official_website} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                    {user.official_website}
                  </a>
                ) : 'Not provided'}
              </span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block font-medium">Buying Capacity</span>
              <span className="font-semibold text-gray-900">{user?.buying_capacity || 'Not specified'}</span>
            </div>
          </div>

          {user?.verification_notes && (
            <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200 mb-6">
              <strong>Admin Review Note:</strong> {user.verification_notes}
            </div>
          )}

          <div className="pt-4 border-t">
            <button
              onClick={() => navigate('/profile')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm"
            >
              ✏️ Update Verification Credentials in Profile
            </button>
          </div>
        </div>
      )}

      {/* Modal: Place Order */}
      {selectedHarvest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">🛒 Order Produce: {selectedHarvest.crop_name}</h3>
              <button onClick={() => setSelectedHarvest(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            {orderError && (
              <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-xs border border-red-200">{orderError}</div>
            )}

            <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 pt-4">
              <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1">
                <div>Farmer: <strong>{selectedHarvest.farmer_name || 'Verified Farmer'}</strong></div>
                <div>Location: 📍 {selectedHarvest.location}</div>
                <div>Price: <strong>₹{selectedHarvest.price} / {selectedHarvest.unit}</strong></div>
                <div>Stock Available: <strong>{selectedHarvest.quantity} {selectedHarvest.unit}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Order Quantity ({selectedHarvest.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max={selectedHarvest.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-hidden"
                  required
                />
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl text-sm flex justify-between font-bold text-emerald-900">
                <span>Estimated Total Price:</span>
                <span>₹{(Number(orderQuantity || 0) * Number(selectedHarvest.price || 0)).toLocaleString()}</span>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedHarvest(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                >
                  {orderSubmitting ? 'Placing Order...' : 'Confirm Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export { BuyerDashboard }
export default BuyerDashboard
