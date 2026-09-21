import React from 'react'
import { VerificationBadge } from './VerificationBadge'

export const HeroBanner = ({ user, marketHighlight = 'Basmati Rice prices up +8.4% in Kolkata Mandi today' }) => {
  const userName = user?.name || 'Farmer'

  return (
    <div style={{
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      marginBottom: '1.75rem',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 50%, #07150d 100%)'
    }}>
      {/* Background Image Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
        mixBlendMode: 'luminosity'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: 'clamp(1.25rem, 3vw, 2.25rem)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Good morning, {userName} 🌱
            </h1>
            <VerificationBadge status={user?.verification_status} role={user?.role} size="md" />
          </div>

          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#34d399', fontWeight: 600, marginBottom: '0.85rem' }}>
            Let's find the best opportunity for your harvest today.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#9ca3af' }}>
            <span>📍 Location: <strong style={{ color: '#f3f4f6' }}>{user?.location || 'Location Not Specified'}</strong></span>
            <span>•</span>
            <span>🌱 Role: <strong style={{ color: '#10b981', textTransform: 'capitalize' }}>{user?.role || 'Farmer'}</strong></span>
          </div>
        </div>

        {/* Small Floating Information Card */}
        <div style={{
          backgroundColor: 'rgba(9, 24, 17, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>📈</span>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Market Alert
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#f3f4f6', fontWeight: 600, lineHeight: 1.35 }}>
            {marketHighlight}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
