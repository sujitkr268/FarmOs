import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/market-prices?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Build role-specific nav items for desktop (if needed on top header when sidebar is collapsed or on smaller screens)
  let navItems = []

  if (isAuthenticated && user) {
    if (user.role === 'farmer') {
      navItems = [
        { label: t('nav.farmerDashboard') || 'Dashboard', path: '/farmer/dashboard' },
        { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices' },
        { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace' },
        { label: t('nav.weather') || 'Weather', path: '/weather' },
        { label: t('nav.traderDirectory') || 'Traders', path: '/traders' },
        { label: t('nav.assistant') || 'AI Assistant', path: '/assistant' },
        { label: 'Profile', path: '/profile' }
      ]
    } else if (user.role === 'buyer') {
      navItems = [
        { label: t('nav.buyerDashboard') || 'Dashboard', path: '/buyer/dashboard' },
        { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices' },
        { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace' },
        { label: t('nav.weather') || 'Weather', path: '/weather' },
        { label: t('nav.traderDirectory') || 'Traders', path: '/traders' },
        { label: t('nav.assistant') || 'AI Assistant', path: '/assistant' },
        { label: 'Profile', path: '/profile' }
      ]
    } else if (user.role === 'admin') {
      navItems = [
        { label: t('nav.adminDashboard') || 'Admin Dashboard', path: '/admin/dashboard' },
        { label: t('nav.traderDirectory') || 'Traders', path: '/traders' },
        { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices' },
        { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace' },
        { label: 'Profile', path: '/profile' }
      ]
    }
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      backgroundColor: 'rgba(12, 20, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(31, 56, 42, 0.6)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Left: Mobile Brand Logo / Title if sidebar is hidden */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.02em', flexShrink: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#080e0a'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <span style={{ color: '#ffffff' }}>Farm<span style={{ color: '#10b981' }}>OS</span></span>
          </Link>
        </div>

        {/* Center: Topbar Search Input (Desktop) */}
        {isAuthenticated && (
          <form onSubmit={handleSearchSubmit} className="topbar-search" style={{ flex: 1, maxWidth: '440px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#111b15',
              border: '1px solid rgba(31, 56, 42, 0.8)',
              borderRadius: '12px',
              padding: '0.4rem 0.85rem',
              gap: '0.6rem',
              transition: 'all 0.2s'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search crops, mandis, buyers, traders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f3f4f6',
                  fontSize: '0.85rem',
                  width: '100%'
                }}
              />
            </div>
          </form>
        )}

        {/* Right Action Tools: Language Switcher, Gemini Launcher, Notifications, Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#111b15',
            border: '1px solid rgba(31, 56, 42, 0.8)',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#080e0a' : '#9ca3af',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.65rem',
                cursor: 'pointer',
                fontWeight: language === 'en' ? 700 : 500,
                transition: 'all 0.2s'
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#10b981' : 'transparent',
                color: language === 'hi' ? '#080e0a' : '#9ca3af',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.65rem',
                cursor: 'pointer',
                fontWeight: language === 'hi' ? 700 : 500,
                transition: 'all 0.2s'
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* AI Quick Launcher Button */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/assistant')}
              title="Launch Gemini AI Assistant"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <rect x="4" y="8" width="16" height="12" rx="2" />
                <circle cx="9" cy="13" r="1" />
                <circle cx="15" cy="13" r="1" />
              </svg>
              <span className="hidden-mobile">AI Assistant</span>
            </button>
          )}

          {/* Authenticated User Badge & Logout */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#111b15',
                  border: '1px solid rgba(31, 56, 42, 0.8)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#080e0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.78rem'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }} className="hidden-mobile">
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', lineHeight: 1.1 }}>{user.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                color: '#f3f4f6',
                border: '1px solid rgba(31, 56, 42, 0.8)',
                backgroundColor: '#111b15',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}>
                {t('nav.login')}
              </Link>
              <Link to="/register" style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                backgroundColor: '#10b981',
                color: '#080e0a',
                fontWeight: 700,
                fontSize: '0.82rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}>
                {t('nav.getStarted')}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#111b15',
              border: '1px solid rgba(31, 56, 42, 0.8)',
              color: '#10b981',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0c140e',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} className="mobile-drawer">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: location.pathname === item.path ? '#10b981' : '#f3f4f6',
                fontWeight: location.pathname === item.path ? 700 : 500,
                fontSize: '0.95rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(31, 56, 42, 0.5)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .topbar-search { display: none !important; }
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-hamburger { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  )
}
