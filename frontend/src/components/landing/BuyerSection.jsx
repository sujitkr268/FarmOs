import React, { useState, useEffect } from 'react'
import { getRegisteredBuyers } from '../../api/buyerApi'
import { getPublicTraders } from '../../api/traderApi'
import TrustBadge from '../TrustBadge'
import { Link } from 'react-router-dom'

export const BuyerSection = () => {
  const [buyersList, setBuyersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const [buyersRes, tradersRes] = await Promise.all([
          getRegisteredBuyers({ limit: 3, verification_status: 'verified' }).catch(() => ({ buyers: [] })),
          getPublicTraders({ limit: 3, verification_status: 'source_verified' }).catch(() => ({ traders: [] }))
        ])

        const combined = [
          ...(buyersRes.buyers || []).map(b => ({
            id: `buyer-${b.id}`,
            name: b.business_name || b.name,
            location: `${b.district || b.location || 'Kolkata'}, ${b.state || 'West Bengal'}`,
            commodities: b.commodities || 'Potato, Rice, Paddy',
            capacity: b.buying_capacity || '1,000 MT / year',
            badge: b.verification_status || 'verified',
            phone: b.show_contact_publicly ? b.phone : null,
            role: 'buyer'
          })),
          ...(tradersRes.traders || []).map(t => ({
            id: `trader-${t.id}`,
            name: t.business_name,
            location: `${t.district || t.city || 'Kolkata'}, ${t.state || 'West Bengal'}`,
            commodities: t.commodities || 'Agricultural Produce',
            capacity: t.buying_capacity || '5,000 MT / year',
            badge: t.verification_status || 'source_verified',
            phone: t.public_phone || null,
            role: 'trader'
          }))
        ]

        setBuyersList(combined.slice(0, 3))
      } catch (err) {
        console.error('Fetch landing buyers error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBuyers()
  }, [])

  return (
    <section style={{
      backgroundColor: '#f7faf8',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Verified Agricultural Network
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Connect With Potential Buyers
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            Discover legitimate wholesalers, rice millers, and verified FarmOS buyers in your region.
          </p>
        </div>

        {/* Buyers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2.5rem'
        }}>
          {loading ? (
            <div style={{ textAlignment: 'center', padding: '2rem', color: '#64748b' }}>Loading buyers...</div>
          ) : (
            buyersList.map((b) => (
              <div key={b.id} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#022c22', margin: 0 }}>
                      {b.name}
                    </h3>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <TrustBadge status={b.badge} role={b.role} size="sm" />
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    <div>📍 <strong>Location:</strong> {b.location}</div>
                    <div>🌾 <strong>Commodities:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{b.commodities}</span></div>
                    <div>📦 <strong>Capacity:</strong> {b.capacity}</div>
                  </div>
                </div>

                <div>
                  {b.phone ? (
                    <a
                      href={`tel:${b.phone}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        textDecoration: 'none'
                      }}
                    >
                      📞 Contact Buyer ({b.phone})
                    </a>
                  ) : (
                    <Link
                      to="/traders"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        color: '#059669',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        textDecoration: 'none'
                      }}
                    >
                      🔒 Directory Listing (View Profile)
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/traders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#022c22',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '0.85rem 2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(2, 44, 34, 0.2)'
            }}
          >
            <span>Explore Full Business Directory</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
