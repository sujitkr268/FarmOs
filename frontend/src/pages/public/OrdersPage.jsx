import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getFarmerOrdersApi, getBuyerOrdersApi, updateOrderStatusApi } from '../../api/orderApi'
import { LoadingState } from '../../components/LoadingState'
import { EmptyState } from '../../components/EmptyState'

export const OrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      if (user?.role === 'buyer') {
        const res = await getBuyerOrdersApi()
        setOrders(res.orders || [])
      } else {
        const res = await getFarmerOrdersApi()
        setOrders(res.orders || [])
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err)
      setError('Failed to fetch purchase orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) fetchOrders()
  }, [user])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus)
      setSuccess(`Order #${orderId} marked as ${newStatus}.`)
      fetchOrders()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.')
    }
  }

  return (
    <div style={{ color: '#f3f4f6', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 60%, #06120c 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        marginBottom: '1.75rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          🛍️ Purchase Orders Management
        </h1>
        <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 600 }}>
          {user?.role === 'buyer' ? 'Track your procurement orders placed with verified farmers.' : 'Manage incoming purchase orders from verified buyers.'}
        </p>
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
          ✅ {success}
        </div>
      )}

      {/* Orders Table Container */}
      <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
        {loading ? (
          <LoadingState message="Loading your purchase orders..." />
        ) : orders.length === 0 ? (
          <EmptyState icon="📦" title="No Orders Found" description="There are no purchase orders matching your account right now." />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Crop</th>
                  <th style={{ padding: '0.75rem' }}>Quantity</th>
                  <th style={{ padding: '0.75rem' }}>Total Cost</th>
                  <th style={{ padding: '0.75rem' }}>{user?.role === 'buyer' ? 'Farmer' : 'Buyer'}</th>
                  <th style={{ padding: '0.75rem' }}>Location</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  {user?.role !== 'buyer' && <th style={{ padding: '0.75rem' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.4)', color: '#f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>#{o.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.crop_name}</td>
                    <td style={{ padding: '0.75rem' }}>{o.quantity} {o.unit}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{o.total_price}</td>
                    <td style={{ padding: '0.75rem' }}>{user?.role === 'buyer' ? o.farmer_name : o.buyer_name}</td>
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
                    {user?.role !== 'buyer' && (
                      <td style={{ padding: '0.75rem' }}>
                        {o.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button onClick={() => handleUpdateStatus(o.id, 'accepted')} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#10b981', color: '#06120c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Accept</button>
                            <button onClick={() => handleUpdateStatus(o.id, 'rejected')} style={{ padding: '0.3rem 0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Completed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
