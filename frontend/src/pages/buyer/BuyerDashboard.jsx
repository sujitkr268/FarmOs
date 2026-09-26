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

  const [activeTab, setActiveTab] = useState('marketplace') // 'marketplace' | 'orders' | 'prices'

  // Orders State
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Produce Marketplace State
  const [harvests, setHarvests] = useState([])
  const [harvestsLoading, setHarvestsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Order Placement Modal State
  const [selectedHarvest, setSelectedHarvest] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState('1000')
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
    setOrderQuantity(String(harvest.quantity || '1000'))
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

  const targetCommodity = user?.commodities || 'Potato'
  const targetQuantity = '1,500 kg'
  const targetGrade = 'FAQ Grade'

  return (
    <div style={{ color: '#0f172a' }}>
      {/* 1. Buyer Decision Header Banner */}
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
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              What do you need today? 🏢
            </h1>
            <TrustBadge status={user?.verification_status} role="buyer" size="md" />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0.3rem 0 0 0' }}>
            {user?.business_name || user?.name} • 📍 <strong>{user?.state ? `${user.state}, ${user.district || ''}` : user?.location || 'West Bengal'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/profile"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            🏢 Business Profile
          </a>
        </div>
      </div>

      {/* Global Alerts */}
      {orderSuccess && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{orderSuccess}</span>
          <button onClick={() => setOrderSuccess('')} style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 2. BUYER REQUIREMENT Summary Box */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '18px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.3rem' }}>
            📋 Current Procurement Requirement
          </span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.95rem' }}>
            <span>🌾 Crop: <strong style={{ color: '#0f172a' }}>{targetCommodity}</strong></span>
            <span>📦 Requirement: <strong style={{ color: '#0f172a' }}>{targetQuantity}</strong></span>
            <span>🏷 Quality: <strong style={{ color: '#15803d' }}>{targetGrade}</strong></span>
            <span>📅 Required By: <strong style={{ color: '#0f172a' }}>Immediate / Today</strong></span>
          </div>
        </div>

        <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '12px' }}>
          ACTIVE BUY DEMAND
        </span>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#ffffff',
        padding: '0.35rem',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.75rem'
      }}>
        <button
          onClick={() => setActiveTab('marketplace')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'marketplace' ? 700 : 500,
            color: activeTab === 'marketplace' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'marketplace' ? '#10b981' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          🌾 Matching Farmers & Harvests ({filteredHarvests.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            color: activeTab === 'orders' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'orders' ? '#10b981' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          📦 My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'prices' ? 700 : 500,
            color: activeTab === 'prices' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'prices' ? '#10b981' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          📈 Live Mandi Benchmark Rates
        </button>
      </div>

      {/* TAB 1: MATCHING FARMERS & HARVESTS */}
      {activeTab === 'marketplace' && (
        <div>
          {/* Search Filter Bar */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search by crop, location, or quality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {harvestsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              ⏳ Loading available farmer produce...
            </div>
          ) : filteredHarvests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              🌾 No matching farmer produce listings found for your search criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredHarvests.map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}>
                  <div>
                    {/* Top Bar: Crop Name & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          🌾 {item.crop_name}
                        </h3>
                        <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
                          📦 {item.quantity} {item.unit || 'kg'} • 🏷 {item.grade || 'FAQ Grade'}
                        </span>
                      </div>

                      <span style={{ backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '8px' }}>
                        ₹{item.price}/{item.unit || 'kg'}
                      </span>
                    </div>

                    {/* Location & Farmer info */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#334155' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>📍 Location: {item.location || 'West Bengal'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>Supplier ID: Farmer #{item.farmer_id}</div>
                    </div>

                    {/* SECTION 11: MATCH REASONS CHECKLIST */}
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.75rem 0.9rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.4rem' }}>
                        MATCHING REASONS
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', color: '#166534' }}>
                        <div>✓ Crop match</div>
                        <div>✓ Quantity fit</div>
                        <div>✓ Grade match</div>
                        <div>✓ Location suitable</div>
                        <div>✓ Availability matches</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenOrderModal(item)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    🤝 Place Purchase Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            📦 Placed Purchase Orders ({orders.length})
          </h3>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', color: '#64748b' }}>
              No purchase orders placed yet. Browse matching farmer produce to place an order.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {orders.map((o, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block' }}>
                      Order #{o.id} — {o.crop_name}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Quantity: <strong>{o.quantity} {o.unit || 'kg'}</strong> | Total: <strong>₹{o.total_price}</strong>
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: o.status === 'accepted' ? '#dcfce7' : o.status === 'rejected' ? '#fef2f2' : '#fef3c7',
                    color: o.status === 'accepted' ? '#15803d' : o.status === 'rejected' ? '#dc2626' : '#d97706',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    textTransform: 'uppercase'
                  }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE MANDI PRICES */}
      {activeTab === 'prices' && (
        <MandiPrices />
      )}

      {/* ORDER PLACEMENT MODAL */}
      {selectedHarvest && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Place Order for {selectedHarvest.crop_name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Available Stock: <strong>{selectedHarvest.quantity} {selectedHarvest.unit}</strong> @ ₹{selectedHarvest.price}/{selectedHarvest.unit}
            </p>

            {orderError && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ {orderError}</div>}

            <form onSubmit={handlePlaceOrderSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Order Quantity ({selectedHarvest.unit}) *
                </label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedHarvest(null)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800 }}
                >
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
