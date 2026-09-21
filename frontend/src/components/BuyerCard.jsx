import React from 'react'
import { VerificationBadge } from './VerificationBadge'

export const BuyerCard = ({ buyer, onContact }) => {
  if (!buyer) return null

  const {
    business_name = 'Agri Trader Business',
    name = 'Traders Ltd',
    verification_status = 'verified',
    location = 'Bardhaman, West Bengal',
    state = '',
    district = '',
    commodities = 'Rice, Wheat, Potato',
    buying_capacity = '500 Quintals / Month',
    public_contact_consent = false,
    phone = '',
    email = ''
  } = buyer

  const displayLocation = state ? `${state}${district ? `, ${district}` : ''}` : location

  return (
    <div className="farm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', lineHeight: 1.2 }}>
              🏢 {business_name || name}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>📍 {displayLocation}</span>
          </div>
          <VerificationBadge status={verification_status} role="buyer" size="sm" />
        </div>

        <div style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <div>
            <span style={{ color: '#6b7280' }}>Commodities: </span>
            <strong style={{ color: '#10b981' }}>{commodities || 'General Agro Produce'}</strong>
          </div>
          {buying_capacity && (
            <div>
              <span style={{ color: '#6b7280' }}>Buying Capacity: </span>
              <strong style={{ color: '#f3f4f6' }}>{buying_capacity}</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(31, 64, 46, 0.6)' }}>
        {public_contact_consent ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {phone && (
              <a
                href={`tel:${phone}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#10b981',
                  color: '#06120c',
                  fontWeight: 700,
                  borderRadius: '8px',
                  fontSize: '0.78rem'
                }}
              >
                📞 Call
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.5rem',
                  backgroundColor: '#14291d',
                  border: '1px solid rgba(31, 64, 46, 0.8)',
                  color: '#f3f4f6',
                  fontWeight: 600,
                  borderRadius: '8px',
                  fontSize: '0.78rem'
                }}
              >
                ✉️ Email
              </a>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '0.4rem' }}>
            🔒 Contact details kept private per buyer settings
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerCard
