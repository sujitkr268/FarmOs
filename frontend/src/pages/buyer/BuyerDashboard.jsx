import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getBuyerOrdersApi } from '../../api/orderApi'
import { MandiPrices } from '../../components/MandiPrices'
import { useNavigate } from 'react-router-dom'

// Reusable Components
import { MetricCard } from '../../components/MetricCard'
import { VerificationBadge } from '../../components/VerificationBadge'
import { LoadingState } from '../../components/LoadingState'
import { EmptyState } from '../../components/EmptyState'

export const BuyerDashboard = () => {
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
      setOrderSuccess('🎉 Purchase order submitted successfully to farmer for confirmation!')
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
      {/* 1. Header Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 50%, #07150d 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
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
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {user?.business_name || user?.name} 🏢
            </h1>
            <VerificationBadge status={user?.verification_status} role="buyer" size="md" />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>📍 Location: <strong style={{ color: '#f3f4f6' }}>{user?.state ? `${user.state}, ${user.district || ''}` : user?.location || 'Location Not Specified'}</strong></span>
            {user?.mandi && <span>• Mandi: <strong style={{ color: '#10b981' }}>{user.mandi}</strong></span>}
          </p>
        </div>

        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#10b981',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}
        >
          🏢 Manage Business Profile
        </button>
      </div>

      {/* Global Alerts */}
      {orderSuccess && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{orderSuccess}</span>
          <button onClick={() => setOrderSuccess('')} style={{ background: 'none', border: 'none', color: '#6ee7b7', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 2. Stat Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <MetricCard title="Orders Placed" value={totalOrdersCount} icon="📦" subtitle="Total Direct Procurement" color="blue" />
        <MetricCard title="Pending Approval" value={pendingOrdersCount} icon="⏳" subtitle="Awaiting Farmer Confirmation" color="amber" />
        <MetricCard title="Accepted Orders" value={acceptedOrdersCount} icon="✅" subtitle="Confirmed for Fulfillment" color="emerald" />
        <MetricCard title="Verification Status" value={user?.verification_status === 'verified' ? 'Verified' : 'Pending'} icon="🛡️" subtitle="Buyer Trust Level" color="purple" />
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#0f2218',
        padding: '0.4rem',
        borderRadius: '14px',
        border: '1px solid rgba(31, 64, 46, 0.8)',
        marginBottom: '1.75rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            color: activeTab === 'orders' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'orders' ? '#10b981' : 'transparent',
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
            color: activeTab === 'marketplace' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'marketplace' ? '#10b981' : 'transparent',
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
            color: activeTab === 'prices' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'prices' ? '#10b981' : 'transparent',
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
            color: activeTab === 'verification' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'verification' ? '#10b981' : 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          🛡️ Verification Credentials
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>📦 Purchase Orders Placed</h3>

          {ordersLoading ? (
            <LoadingState message="Loading your purchase orders..." />
          ) : orders.length === 0 ? (
            <EmptyState icon="🛒" title="No Orders Placed Yet" description="You haven't placed any purchase orders. Browse available produce to order." actionText="Browse Produce" onAction={() => setActiveTab('marketplace')} />
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
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
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.4)', color: '#f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.crop_name}</td>
                      <td style={{ padding: '0.75rem' }}>{o.quantity} {o.unit}</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{o.total_price}</td>
                      <td style={{ padding: '0.75rem' }}>{o.farmer_name}</td>
                      <td style={{ padding: '0.75rem' }}>📍 {o.location}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
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

      {/* TAB 2: BROWSE PRODUCE */}
      {activeTab === 'marketplace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#0f2218', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(31, 64, 46, 0.8)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search produce by crop name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: '200px', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#f3f4f6', fontSize: '0.85rem' }}
            />
          </div>

          {harvestsLoading ? (
            <LoadingState message="Fetching available produce harvest listings..." />
          ) : filteredHarvests.length === 0 ? (
            <EmptyState icon="🌾" title="No Available Produce Found" description="No available crop listings match your search right now." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {filteredHarvests.map((h) => (
                <div key={h.id} className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{h.crop_name}</h4>
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                        Available
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      <div>Stock: <strong style={{ color: '#f3f4f6' }}>{h.quantity} {h.unit}</strong></div>
                      <div>Price: <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>₹{h.price} / {h.unit}</strong></div>
                      <div>Farmer: <span style={{ color: '#f3f4f6', fontWeight: 600 }}>{h.farmer_name || 'Verified Farmer'}</span></div>
                      <div>Location: 📍 {h.location}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenOrderModal(h)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem' }}
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
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
          <MandiPrices />
        </div>
      )}

      {/* TAB 4: VERIFICATION CREDENTIALS */}
      {activeTab === 'verification' && (
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>🛡️ Buyer Verification Credentials</h3>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
            FarmOS verified buyers receive lower platform fees, direct contact access with farmers, and trusted buyer badges.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <VerificationBadge status={user?.verification_status} role="buyer" size="lg" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#06120c', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(31, 64, 46, 0.6)' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>e-NAM Reference ID</span>
              <span style={{ fontWeight: 700, color: '#f3f4f6', fontFamily: 'monospace' }}>{user?.enam_reference || 'Not provided'}</span>
            </div>
            <div style={{ backgroundColor: '#06120c', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(31, 64, 46, 0.6)' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Udyam Registration</span>
              <span style={{ fontWeight: 700, color: '#f3f4f6', fontFamily: 'monospace' }}>{user?.udyam_reference || 'Not provided'}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            style={{ padding: '0.6rem 1.25rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem' }}
          >
            ✏️ Update Verification Credentials
          </button>
        </div>
      )}

      {/* Order Placement Modal */}
      {selectedHarvest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="farm-modal-content" style={{ backgroundColor: '#0f2218', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid rgba(31, 64, 46, 0.8)', paddingBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6' }}>🛒 Order Produce: {selectedHarvest.crop_name}</h3>
              <button onClick={() => setSelectedHarvest(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {orderError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.85rem' }}>{orderError}</div>
            )}

            <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ backgroundColor: '#06120c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>Farmer: <strong style={{ color: '#f3f4f6' }}>{selectedHarvest.farmer_name || 'Verified Farmer'}</strong></div>
                <div>Location: 📍 {selectedHarvest.location}</div>
                <div>Price: <strong style={{ color: '#10b981' }}>₹{selectedHarvest.price} / {selectedHarvest.unit}</strong></div>
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
                  style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#f3f4f6' }}
                  required
                />
              </div>

              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#10b981' }}>
                <span>Estimated Total:</span>
                <span>₹{(Number(orderQuantity || 0) * Number(selectedHarvest.price || 0)).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                <button type="button" onClick={() => setSelectedHarvest(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#14291d', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.82rem' }}>Cancel</button>
                <button type="submit" disabled={orderSubmitting} style={{ padding: '0.5rem 1.15rem', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, borderRadius: '8px', fontSize: '0.82rem' }}>
                  {orderSubmitting ? 'Submitting...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyerDashboard
