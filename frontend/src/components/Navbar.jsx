import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
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
    { label: 'Home', path: '/' },
    { label: 'Market Prices', path: '/market-prices' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Weather', path: '/weather' },
    { label: 'Traders', path: '/traders' },
    { label: 'AI Assistant', path: '/assistant' }
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 999,
      backgroundColor: '#071912',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      width: '100%',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        width: '100%'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#071912',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🌱
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Farm<span style={{ color: '#34d399' }}>OS</span>
          </span>
        </Link>

        {/* Center: Search Input (when authenticated) or Navigation Links */}
        {isAuthenticated ? (
          <form onSubmit={handleSearchSubmit} className="topbar-search" style={{ flex: 1, maxWidth: '380px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              gap: '0.6rem'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a89c" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search markets, crops, buyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  width: '100%'
                }}
              />
            </div>
          </form>
        ) : (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile-nav">
            {publicNavLinks.map((link, idx) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={idx}
                  to={link.path}
                  style={{
                    color: isActive ? '#34d399' : '#cde0d5',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    transition: 'color 0.2s ease',
                    textDecoration: 'none'
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
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.78rem'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#94a89c',
                border: 'none',
                borderRadius: '16px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: language === 'en' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#10b981' : 'transparent',
                color: language === 'hi' ? '#ffffff' : '#94a89c',
                border: 'none',
                borderRadius: '16px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: language === 'hi' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>

          {/* Authenticated User Menu or Auth CTAs */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Dashboard
              </button>
              <div
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.25rem 0.75rem 0.25rem 0.35rem',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }} className="hidden-mobile-nav">
                  {user.name}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '10px',
                  color: '#ffffff',
                  backgroundColor: '#10b981',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Get Started
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#34d399',
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
          backgroundColor: '#071912',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
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
              style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.92rem', padding: '0.4rem 0', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
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
        @media (max-width: 840px) {
          .topbar-search { display: none !important; }
          .hidden-mobile-nav { display: none !important; }
        }
        @media (min-width: 841px) {
          .mobile-hamburger { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  )
}
