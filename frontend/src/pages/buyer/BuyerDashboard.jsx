import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getBuyerOrdersApi } from '../../api/orderApi'
import { MandiPrices } from '../../components/MandiPrices'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = searchParams.get('tab') || 'marketplace'
  const [activeTab, setActiveTab] = useState(initialTab) // 'marketplace' | 'orders' | 'prices'

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
    const defaultQty = Math.min(Number(harvest.quantity || 1000), 1500)
    setOrderQuantity(String(defaultQty))
    setOrderError('')
    setOrderSuccess('')
  }

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault()
    setOrderError('')
    setOrderSuccess('')

    const qty = Number(orderQuantity)
    if (isNaN(qty) || qty <= 0) {
      setOrderError('Order quantity must be a positive number greater than zero.')
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
      handleTabChange('orders')
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place purchase order.')
    } finally {
      setOrderSubmitting(false)
    }
  }

  const targetCommodity = user?.commodities || 'Potato'
  const targetQuantity = user?.buying_capacity || '1,500 kg'
  const targetGrade = user?.required_grade || 'FAQ Grade'

  // Strict crop matching for buyer procurement
  const filteredHarvests = harvests.filter(h => {
    const matchesCrop = targetCommodity ? (h.crop_name?.toLowerCase().includes(targetCommodity.toLowerCase()) || targetCommodity.toLowerCase().includes(h.crop_name?.toLowerCase())) : true
    if (!searchQuery.trim()) return matchesCrop
    const q = searchQuery.toLowerCase()
    return matchesCrop && (
      h.crop_name?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q)
    )
  })

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
              fontSize: '0.88rem',
              textDecoration: 'none'
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
            <span>🌾 Commodity: <strong style={{ color: '#0f172a' }}>{targetCommodity}</strong></span>
            <span>📦 Capacity: <strong style={{ color: '#0f172a' }}>{targetQuantity}</strong></span>
            <span>🏷 Required Quality: <strong style={{ color: '#15803d' }}>{targetGrade}</strong></span>
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
          onClick={() => handleTabChange('marketplace')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'marketplace' ? 700 : 500,
            color: activeTab === 'marketplace' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'marketplace' ? '#10b981' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🌾 Matching Farmers & Produce ({filteredHarvests.length})
        </button>
        <button
          onClick={() => handleTabChange('orders')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            color: activeTab === 'orders' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'orders' ? '#10b981' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📦 My Placed Orders ({orders.length})
        </button>
        <button
          onClick={() => handleTabChange('prices')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'prices' ? 700 : 500,
            color: activeTab === 'prices' ? '#ffffff' : '#64748b',
            backgroundColor: activeTab === 'prices' ? '#10b981' : 'transparent',
            border: 'none',
            cursor: 'pointer',
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
              placeholder="Search by location, description, or crop..."
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
              🌾 No matching farmer produce listings found for your commodity requirement ({targetCommodity}).
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        🌾 {item.crop_name}
                      </h3>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                        {item.grade || 'FAQ Grade'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                      <div>📦 Available Stock: <strong>{Number(item.quantity).toLocaleString()} {item.unit || 'kg'}</strong></div>
                      <div>📍 Location: <strong>{item.location || 'West Bengal'}</strong></div>
                      <div>🏷 Price: <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>₹{Number(item.price || 0).toLocaleString()}</strong> /{item.unit || 'kg'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenOrderModal(item)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    🤝 Create Purchase Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PLACED ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            📦 My Submitted Purchase Orders ({orders.length})
          </h2>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>⏳ Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
              📦 No purchase orders placed yet. Browse matching farmer produce to order.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((ord) => {
                const isPending = ord.status === 'pending'
                const isAccepted = ord.status === 'accepted'

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
                        <span>🌾 Farmer: <strong>{ord.farmer_name || 'Verified Farmer'}</strong></span>
                        {ord.farmer_phone && <span>📞 Contact: <strong>{ord.farmer_phone}</strong></span>}
                        <span>📅 Date: {new Date(ord.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE MANDI BENCHMARK RATES */}
      {activeTab === 'prices' && (
        <MandiPrices />
      )}

      {/* ORDER PLACEMENT MODAL */}
      {selectedHarvest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
              Create Purchase Order
            </h3>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div>🌾 Commodity: <strong>{selectedHarvest.crop_name}</strong></div>
              <div>🏷 Quality Grade: <strong>{selectedHarvest.grade || 'FAQ Grade'}</strong></div>
              <div>📦 Available Stock: <strong>{Number(selectedHarvest.quantity).toLocaleString()} {selectedHarvest.unit || 'kg'}</strong></div>
              <div>💰 Unit Price: <strong>₹{Number(selectedHarvest.price).toLocaleString()} /{selectedHarvest.unit || 'kg'}</strong></div>
            </div>

            {orderError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {orderError}
              </div>
            )}

            <form onSubmit={handlePlaceOrderSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Requested Quantity ({selectedHarvest.unit || 'kg'}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedHarvest.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
                  Max allowed: min({Number(selectedHarvest.quantity).toLocaleString()} {selectedHarvest.unit}, buyer requirement)
                </span>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: '#166534', fontWeight: 700 }}>Estimated Total:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                  ₹{(Number(orderQuantity || 0) * Number(selectedHarvest.price || 0)).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedHarvest(null)}
                  style={{ padding: '0.65rem 1.2rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#334155', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  style={{ padding: '0.65rem 1.4rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                >
                  {orderSubmitting ? 'Submitting...' : 'Submit Order'}
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
