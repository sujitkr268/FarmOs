import React from 'react'
import TrustBadge from '../TrustBadge'
import { useLanguage } from '../../context/LanguageContext'

export const HeroBanner = ({ userName, location, verificationStatus, role = 'farmer' }) => {
  const { t } = useLanguage()

  return (
    <div style={{
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      marginBottom: '1.75rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      minHeight: '180px',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem',
      background: 'linear-gradient(90deg, rgba(11, 35, 25, 0.85) 0%, rgba(15, 51, 34, 0.6) 60%, rgba(0, 0, 0, 0.2) 100%), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div style={{ color: '#ffffff', maxWidth: '650px', zIndex: 2 }}>
        <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {t('home.goodMorning', { name: userName || (role === 'farmer' ? 'Farmer' : 'Buyer') })} 🌱
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: '1rem', fontWeight: 500 }}>
          {t('home.heroDesc')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Location Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <span>📍</span>
            <span>{location || 'West Bengal, Kolkata'}</span>
          </div>

          {/* Verification Badge */}
          <TrustBadge status={verificationStatus} role={role} size="sm" />
        </div>
      </div>

      {/* Floating Motivational Quote Card (Top Right) */}
      <div className="hidden-mobile-quote" style={{
        position: 'absolute',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        maxWidth: '240px',
        color: '#ffffff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.3rem' }}>🌱</span>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
            {t('home.tagline')}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile-quote { display: none !important; }
        }
      `}</style>
    </div>
  )
}
