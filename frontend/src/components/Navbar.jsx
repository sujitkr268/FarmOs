import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import TrustBadge from './TrustBadge'

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

  const navLinks = [
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
      zIndex: 90,
      backgroundColor: '#0b2319',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.7rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        width: '100%'
      }}>
        {/* Left: Search Input Box */}
        {isAuthenticated ? (
          <form onSubmit={handleSearchSubmit} className="topbar-search" style={{ flex: 1, maxWidth: '420px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              gap: '0.6rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search markets, crops, buyers, or anything..."
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#10b981', color: '#0b2319', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🌱
            </div>
            <span>Farm<span style={{ color: '#10b981' }}>OS</span></span>
          </Link>
        )}

        {/* Center Top Nav Links (Desktop) */}
        {isAuthenticated && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="hidden-mobile-nav">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={idx}
                  to={link.path}
                  style={{
                    color: isActive ? '#10b981' : '#cbd5e1',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    transition: 'color 0.15s'
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right Tools: Language Dropdown, Notifications Bell, Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            padding: '2px',
            fontSize: '0.78rem'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '14px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: language === 'en' ? 700 : 500
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#10b981' : 'transparent',
                color: language === 'hi' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '14px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: language === 'hi' ? 700 : 500
              }}
            >
              हिंदी
            </button>
          </div>

          {/* Notifications Bell Icon */}
          {isAuthenticated && (
            <div style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
            </div>
          )}

          {/* User Profile Chip */}
          {isAuthenticated && user ? (
            <div
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
              <div style={{ display: 'flex', flexDirection: 'column' }} className="hidden-mobile-nav">
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>{user.name}</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" style={{ padding: '0.45rem 0.9rem', borderRadius: '10px', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)', fontSize: '0.82rem', fontWeight: 600 }}>Login</Link>
              <Link to="/register" style={{ padding: '0.45rem 0.9rem', borderRadius: '10px', color: '#ffffff', backgroundColor: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>Get Started</Link>
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
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#10b981',
              fontSize: '1.2rem'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0b2319',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }} className="mobile-drawer">
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', padding: '0.4rem 0' }}
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
                fontSize: '0.85rem'
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
