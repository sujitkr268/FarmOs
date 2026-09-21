import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { VerificationBadge } from './VerificationBadge'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Close mobile drawer on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false)
    setNotificationsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

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

  // Define role-specific navigation items for mobile drawer
  let navItems = []
  if (isAuthenticated && user) {
    const dashboardPath = user.role === 'buyer' ? '/buyer/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'
    navItems = [
      { label: 'Dashboard', path: dashboardPath, icon: '📊' },
      { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices', icon: '📈' },
      { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace', icon: '🛒' },
      { label: 'Opportunities', path: '/opportunities', icon: '💡' },
      { label: t('nav.traderDirectory') || 'Traders', path: '/traders', icon: '🤝' },
      { label: t('nav.weather') || 'Weather', path: '/weather', icon: '🌤️' },
      { label: t('nav.assistant') || 'AI Assistant', path: '/assistant', icon: '🤖' },
      { label: 'My Orders', path: '/orders', icon: '🛍️' },
      { label: 'My Harvests', path: '/harvests', icon: '🌾' },
      { label: 'e-NAM Trade', path: '/enam', icon: '🏛️' },
      { label: 'Profile', path: '/profile', icon: '👤' },
      { label: 'Settings', path: '/settings', icon: '⚙️' }
    ]
  } else {
    navItems = [
      { label: 'Home', path: '/', icon: '🏠' },
      { label: t('nav.mandiPrices') || 'Market Prices', path: '/market-prices', icon: '📈' },
      { label: t('nav.marketplace') || 'Marketplace', path: '/marketplace', icon: '🛒' },
      { label: t('nav.weather') || 'Weather', path: '/weather', icon: '🌤️' },
      { label: t('nav.traderDirectory') || 'Traders', path: '/traders', icon: '🤝' },
      { label: t('nav.assistant') || 'AI Assistant', path: '/assistant', icon: '🤖' }
    ]
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(8, 25, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(31, 64, 46, 0.6)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        width: '100%'
      }}>
        {/* Left: Brand Logo & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Drawer"
            aria-expanded={mobileMenuOpen}
            className="mobile-hamburger-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#0f2218',
              border: '1px solid rgba(31, 64, 46, 0.8)',
              color: '#10b981',
              fontSize: '1.25rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.02em', flexShrink: 0 }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06120c',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <span style={{ color: '#ffffff' }}>Farm<span style={{ color: '#10b981' }}>OS</span></span>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop / Tablet) */}
        {isAuthenticated && (
          <form onSubmit={handleSearchSubmit} className="topbar-search-form" style={{ flex: 1, maxWidth: '420px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f2218',
              border: '1px solid rgba(31, 64, 46, 0.8)',
              borderRadius: '12px',
              padding: '0.45rem 0.85rem',
              gap: '0.6rem'
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

        {/* Desktop Quick Nav Links */}
        <div className="topbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>
          <Link to="/market-prices" style={{ color: location.pathname === '/market-prices' ? '#10b981' : '#9ca3af' }}>Market Prices</Link>
          <Link to="/marketplace" style={{ color: location.pathname === '/marketplace' ? '#10b981' : '#9ca3af' }}>Marketplace</Link>
          <Link to="/weather" style={{ color: location.pathname === '/weather' ? '#10b981' : '#9ca3af' }}>Weather</Link>
          <Link to="/traders" style={{ color: location.pathname === '/traders' ? '#10b981' : '#9ca3af' }}>Traders</Link>
          <Link to="/assistant" style={{ color: location.pathname === '/assistant' ? '#10b981' : '#9ca3af' }}>AI Assistant</Link>
        </div>

        {/* Right Tools: Language Toggle, Notifications, User Profile & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0f2218',
            border: '1px solid rgba(31, 64, 46, 0.8)',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#06120c' : '#9ca3af',
                borderRadius: '16px',
                padding: '0.25rem 0.6rem',
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#10b981' : 'transparent',
                color: language === 'hi' ? '#06120c' : '#9ca3af',
                borderRadius: '16px',
                padding: '0.25rem 0.6rem',
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Dropdown Toggle */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View notifications"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#0f2218',
                  border: '1px solid rgba(31, 64, 46, 0.8)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                🔔
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }} />
              </button>

              {/* Notifications Popup */}
              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  width: '280px',
                  backgroundColor: '#0f2218',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '14px',
                  padding: '1rem',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                  zIndex: 101,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem', borderBottom: '1px solid rgba(31, 64, 46, 0.6)', paddingBottom: '0.4rem' }}>
                    🔔 Recent Notifications
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>🌱 <strong style={{ color: '#f3f4f6' }}>Kolkata Mandi:</strong> Basmati Rice price updated +₹150/qtl</div>
                    <div>🛡️ <strong style={{ color: '#10b981' }}>Account Status:</strong> Trust verification active</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Avatar / Logout */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#06120c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="topbar-user-details" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', lineHeight: 1.1 }}>{user.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
                    <VerificationBadge status={user.verification_status} role={user.role} size="sm" />
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                color: '#f3f4f6',
                border: '1px solid rgba(31, 64, 46, 0.8)',
                backgroundColor: '#0f2218',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#06120c',
                fontWeight: 700,
                fontSize: '0.82rem'
              }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer & Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 104
            }}
          />

          {/* Drawer Panel */}
          <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            maxWidth: '82vw',
            backgroundColor: '#071911',
            borderRight: '1px solid rgba(16, 185, 129, 0.3)',
            zIndex: 105,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem 1rem',
            animation: 'slideInLeft 0.2s ease-out'
          }}>
            <div>
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(31, 64, 46, 0.8)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#10b981', color: '#06120c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>🌱</div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Farm<span style={{ color: '#10b981' }}>OS</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.3rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {/* Role & Verification Badge Header */}
              {isAuthenticated && user && (
                <div style={{ backgroundColor: '#0f2218', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(31, 64, 46, 0.8)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6' }}>{user.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
                    <VerificationBadge status={user.verification_status} role={user.role} size="sm" />
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {navItems.map((item, idx) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#10b981' : '#f3f4f6',
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Logout Action in Mobile Drawer */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginTop: '1rem'
                }}
              >
                🚪 Logout
              </button>
            )}
          </aside>
        </>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .topbar-search-form { display: none !important; }
          .topbar-desktop-links { display: none !important; }
          .topbar-user-details { display: none !important; }
          .mobile-hamburger-btn { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}

export default Navbar
