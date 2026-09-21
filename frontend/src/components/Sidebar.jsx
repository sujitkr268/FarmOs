import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { VerificationBadge } from './VerificationBadge'

export const Sidebar = () => {
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (!isAuthenticated || !user) return null

  const dashboardPath = user.role === 'buyer' ? '/buyer/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'

  // 12 Sidebar Navigation Items
  const navLinks = [
    { label: 'Dashboard', path: dashboardPath, icon: '📊' },
    { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices', icon: '📈' },
    { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace', icon: '🛒' },
    { label: 'My Harvests', path: '/harvests', icon: '🌾' },
    { label: 'Orders', path: '/orders', icon: '🛍️' },
    { label: 'Opportunities', path: '/opportunities', icon: '💡' },
    { label: t('nav.weather') || 'Weather', path: '/weather', icon: '🌤️' },
    { label: t('nav.traderDirectory') || 'Trader Directory', path: '/traders', icon: '🤝' },
    { label: t('nav.assistant') || 'AI Assistant', path: '/assistant', icon: '🤖' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' }
  ]

  return (
    <aside
      className="farm-desktop-sidebar"
      style={{
        width: '260px',
        backgroundColor: '#071911',
        borderRight: '1px solid rgba(31, 64, 46, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1rem',
        flexShrink: 0,
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 90
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ padding: '0.5rem 0.75rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06120c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Farm<span style={{ color: '#10b981' }}>OS</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>
              {user.role} Platform
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
          Main Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={idx}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#10b981' : '#9ca3af',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                  transition: 'all 0.15s ease-in-out'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {isActive && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Verification Callout Box */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '14px',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(9, 24, 17, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <VerificationBadge status={user.verification_status} role={user.role} size="sm" />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4, marginBottom: '0.75rem' }}>
          Verified accounts unlock direct buyer connections & top mandi prices.
        </p>
        <Link
          to="/profile"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.45rem',
            borderRadius: '8px',
            backgroundColor: '#10b981',
            color: '#06120c',
            fontWeight: 800,
            fontSize: '0.78rem'
          }}
        >
          Manage Trust Badge
        </Link>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .farm-desktop-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  )
}

export default Sidebar
