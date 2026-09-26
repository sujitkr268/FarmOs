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

  const publicNavLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.mandiPrices'), path: '/market-prices' },
    { label: t('nav.opportunities'), path: '/opportunities' },
    { label: t('nav.traderDirectory'), path: '/traders' },
    { label: t('nav.weather'), path: '/weather' },
    { label: t('nav.assistant'), path: '/assistant' }
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 999,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e4eee7',
      width: '100%',
      boxShadow: '0 2px 10px rgba(11, 35, 25, 0.03)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        width: '100%'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🌿
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0b3d2e', letterSpacing: '-0.025em' }}>
            Farm<span style={{ color: '#10b981' }}>OS</span>
          </span>
        </Link>

        {/* Center: Search Input (authenticated) or Nav Links (unauthenticated) */}
        {isAuthenticated ? (
          <form onSubmit={handleSearchSubmit} className="topbar-search" style={{ flex: 1, maxWidth: '400px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f4f8f5',
              border: '1px solid #d6e4db',
              borderRadius: '24px',
              padding: '0.45rem 1.1rem',
              gap: '0.6rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#647d70" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#10231b',
                  fontSize: '0.88rem',
                  width: '100%',
                  fontWeight: 500
                }}
              />
            </div>
          </form>
        ) : (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="hidden-mobile-nav">
            {publicNavLinks.map((link, idx) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={idx}
                  to={link.path}
                  style={{
                    color: isActive ? '#0b3d2e' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    transition: 'color 0.2s ease',
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                    paddingBottom: '0.2rem'
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right Actions: Language Switcher, Auth & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Language Switcher Pill matching reference */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f4f8f5',
            border: '1px solid #d6e4db',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.8rem'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#0b3d2e' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#647d70',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: language === 'en' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#0b3d2e' : 'transparent',
                color: language === 'hi' ? '#ffffff' : '#647d70',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: language === 'hi' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>

          {/* User Auth Controls */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: '#0b3d2e',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(11, 61, 46, 0.2)'
                }}
              >
                {t('nav.dashboard')}
              </button>
              <div
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#f4f8f5',
                  border: '1px solid #d6e4db',
                  padding: '0.25rem 0.75rem 0.25rem 0.35rem',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10231b' }} className="hidden-mobile-nav">
                  {user.name}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '12px',
                  color: '#0b3d2e',
                  backgroundColor: '#f4f8f5',
                  border: '1px solid #d6e4db',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '12px',
                  color: '#ffffff',
                  backgroundColor: '#0b3d2e',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(11, 61, 46, 0.25)'
                }}
              >
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#f4f8f5',
              border: '1px solid #d6e4db',
              color: '#0b3d2e',
              fontSize: '1.25rem',
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
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #d6e4db',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }} className="mobile-drawer">
          {publicNavLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#10231b', fontWeight: 600, fontSize: '0.95rem', padding: '0.4rem 0', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                marginTop: '0.5rem',
                padding: '0.65rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .topbar-search { display: none !important; }
          .hidden-mobile-nav { display: none !important; }
        }
        @media (min-width: 861px) {
          .mobile-hamburger { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  )
}
