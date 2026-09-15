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
    <div style={{ color: '#f3f4f6' }}>
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1a22 0%, #142834 50%, #0a141b 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
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
              {user?.business_name || user?.name} 🏢
            </h1>
            <TrustBadge status={user?.verification_status} role="buyer" size="md" />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>📍 <strong style={{ color: '#f3f4f6' }}>{user?.state ? `${user.state}, ${user.district || ''}` : user?.location || 'Location Not Specified'}</strong></span>
            {user?.mandi && <span>• Mandi: <strong style={{ color: '#38bdf8' }}>{user.mandi}</strong></span>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/profile"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🏢</span> Business Profile
          </a>
        </div>
      </div>

      {/* Global Alerts */}
      {orderSuccess && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{orderSuccess}</span>
          <button onClick={() => setOrderSuccess('')} style={{ background: 'none', border: 'none', color: '#6ee7b7', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 2. Stat Metrics Grid (4 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Orders Placed</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              📦
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{totalOrdersCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.6rem' }}>Total Direct Procurement</div>
        </div>

        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Pending Approval</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              ⏳
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1.1 }}>{pendingOrdersCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600, marginTop: '0.6rem' }}>Awaiting Farmer Confirmation</div>
        </div>

        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Accepted Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              ✅
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>{acceptedOrdersCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginTop: '0.6rem' }}>Ready for Fulfillment</div>
        </div>

        <div className="stat-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Verification Status</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              🛡️
            </div>
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            <TrustBadge status={user?.verification_status} role="buyer" size="sm" />
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 600, marginTop: '0.6rem' }}>Buyer Account Trust Level</div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#111b15',
        padding: '0.4rem',
        borderRadius: '14px',
        border: '1px solid rgba(31, 56, 42, 0.8)',
        marginBottom: '1.75rem',
        overflowX: 'auto'
      }}>
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
            whiteSpace: 'nowrap'
          }}
        >
          📦 My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'marketplace' ? 700 : 500,
            color: activeTab === 'marketplace' ? '#080e0a' : '#9ca3af',
            backgroundColor: activeTab === 'marketplace' ? '#10b981' : 'transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          🌾 Browse Produce
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'prices' ? 700 : 500,
            color: activeTab === 'prices' ? '#080e0a' : '#9ca3af',
            backgroundColor: activeTab === 'prices' ? '#10b981' : 'transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          📈 Mandi Price Directory
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'verification' ? 700 : 500,
            color: activeTab === 'verification' ? '#080e0a' : '#9ca3af',
            backgroundColor: activeTab === 'verification' ? '#10b981' : 'transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          🛡️ Verification Credentials
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>📦 Purchase Orders Placed</h2>
            <button onClick={fetchOrders} style={{ padding: '0.35rem 0.75rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
              🔄 Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
              <p style={{ fontWeight: 600, color: '#f3f4f6' }}>No purchase orders placed yet.</p>
              <button
                onClick={() => setActiveTab('marketplace')}
                style={{ marginTop: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontSize: '0.85rem', fontWeight: 700, borderRadius: '10px' }}
              >
                Browse Produce Marketplace
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem' }}>Crop</th>
                    <th style={{ padding: '0.75rem' }}>Quantity</th>
                    <th style={{ padding: '0.75rem' }}>Total Cost</th>
                    <th style={{ padding: '0.75rem' }}>Farmer</th>
                    <th style={{ padding: '0.75rem' }}>Location</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(31, 56, 42, 0.4)', color: '#f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.crop_name}</td>
                      <td style={{ padding: '0.75rem' }}>{o.quantity} {o.unit}</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{o.total_price}</td>
                      <td style={{ padding: '0.75rem' }}>{o.farmer_name}</td>
                      <td style={{ padding: '0.75rem' }}>📍 {o.location}</td>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#111b15', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(31, 56, 42, 0.8)', display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search produce by crop name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
            />
            <button
              onClick={fetchMarketplace}
              style={{ padding: '0.6rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem' }}
            >
              Search
            </button>
          </div>

          {harvestsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>{t('common.loading')}</div>
          ) : filteredHarvests.length === 0 ? (
            <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌾</div>
              <p>No available produce listings found matching your search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {filteredHarvests.map((h) => (
                <div key={h.id} className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{h.crop_name}</h4>
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                        Available
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      <div>Stock: <strong style={{ color: '#f3f4f6' }}>{h.quantity} {h.unit}</strong></div>
                      <div>Price: <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>₹{h.price} / {h.unit}</strong></div>
                      <div>Farmer: <span style={{ color: '#f3f4f6', fontWeight: 600 }}>{h.farmer_name || 'Verified Farmer'}</span></div>
                      <div>Location: 📍 {h.location}</div>
                    </div>

                    {h.description && <p style={{ fontSize: '0.78rem', color: '#9ca3af', backgroundColor: '#0c140e', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>{h.description}</p>}
                  </div>

                  <button
                    onClick={() => handleOpenOrderModal(h)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem' }}
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
        <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem' }}>
          <MandiPrices />
        </div>
      )}

      {/* TAB 4: VERIFICATION CREDENTIALS */}
      {activeTab === 'verification' && (
        <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '18px', padding: '1.5rem', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>🛡️ Buyer Verification Credentials</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
            FarmOS verified buyers receive lower platform fees, direct contact access with farmers, and trusted buyer badges.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <TrustBadge status={user?.verification_status} role="buyer" size="lg" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#0c140e', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(31, 56, 42, 0.6)' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>e-NAM Reference ID</span>
              <span style={{ fontWeight: 700, color: '#f3f4f6', fontFamily: 'monospace' }}>{user?.enam_reference || 'Not provided'}</span>
            </div>
            <div style={{ backgroundColor: '#0c140e', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(31, 56, 42, 0.6)' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Udyam Registration</span>
              <span style={{ fontWeight: 700, color: '#f3f4f6', fontFamily: 'monospace' }}>{user?.udyam_reference || 'Not provided'}</span>
            </div>
          </div>

          <div style={{ pt: '1rem', borderTop: '1px solid rgba(31, 56, 42, 0.8)' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{ padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem' }}
            >
              ✏️ Update Verification Credentials
            </button>
          </div>
        </div>
      )}

      {/* Modal: Place Order */}
      {selectedHarvest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(31, 56, 42, 0.8)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>🛒 Order Produce: {selectedHarvest.crop_name}</h3>
              <button onClick={() => setSelectedHarvest(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {orderError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '1rem' }}>{orderError}</div>
            )}

            <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#0c140e', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>Farmer: <strong style={{ color: '#f3f4f6' }}>{selectedHarvest.farmer_name || 'Verified Farmer'}</strong></div>
                <div>Location: 📍 {selectedHarvest.location}</div>
                <div>Price: <strong style={{ color: '#10b981' }}>₹{selectedHarvest.price} / {selectedHarvest.unit}</strong></div>
                <div>Available: <strong style={{ color: '#f3f4f6' }}>{selectedHarvest.quantity} {selectedHarvest.unit}</strong></div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                  Order Quantity ({selectedHarvest.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max={selectedHarvest.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#f3f4f6' }}
                  required
                />
              </div>

              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#10b981' }}>
                <span>Estimated Total:</span>
                <span>₹{(Number(orderQuantity || 0) * Number(selectedHarvest.price || 0)).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedHarvest(null)} style={{ padding: '0.55rem 1.1rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={orderSubmitting} style={{ padding: '0.55rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>
                  {orderSubmitting ? 'Placing Order...' : 'Confirm Order'}
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
