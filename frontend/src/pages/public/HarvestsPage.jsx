import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { LoadingState } from '../../components/LoadingState'
import { EmptyState } from '../../components/EmptyState'

export const HarvestsPage = () => {
  const { user } = useAuth()
  const [harvests, setHarvests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHarvests = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/harvests')
      const all = res.data?.harvests || []
      if (user?.role === 'farmer') {
        setHarvests(all.filter((h) => String(h.farmer_id) === String(user?.id)))
      } else {
        setHarvests(all.filter((h) => h.status === 'available'))
      }
    } catch (err) {
      console.error('Fetch Harvests Error:', err)
      setError('Failed to load harvest listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHarvests()
  }, [user])

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
          🌾 Harvest Produce Listings
        </h1>
        <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 600 }}>
          {user?.role === 'farmer' ? 'Manage your active agricultural produce listings and stock.' : 'Explore available crop harvests directly from verified farmers.'}
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <LoadingState message="Fetching crop harvest listings..." />
      ) : harvests.length === 0 ? (
        <EmptyState icon="🌾" title="No Harvest Listings Found" description="There are no harvest produce listings matching your account criteria." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {harvests.map((h) => (
            <div key={h.id} className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{h.crop_name}</h4>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {h.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <div>Stock Quantity: <strong style={{ color: '#f3f4f6' }}>{h.quantity} {h.unit}</strong></div>
                  <div>Price: <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>₹{h.price} / {h.unit}</strong></div>
                  <div>Farmer: <span style={{ color: '#f3f4f6', fontWeight: 600 }}>{h.farmer_name || 'Verified Farmer'}</span></div>
                  <div>Location: 📍 {h.location}</div>
                </div>

                {h.description && <p style={{ fontSize: '0.78rem', color: '#9ca3af', backgroundColor: '#06120c', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>{h.description}</p>}
              </div>

              <div style={{ pt: '0.6rem', borderTop: '1px solid rgba(31, 64, 46, 0.6)' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Listing #{h.id} • Posted recently</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HarvestsPage
