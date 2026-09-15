import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

export const LandingNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { label: t('nav.home', 'Home'), path: '/', isHome: true },
    { label: t('nav.marketPrices', 'Market Prices'), path: '/market-prices' },
    { label: t('nav.marketplace', 'Marketplace'), path: '/marketplace' },
    { label: t('nav.weather', 'Weather'), path: '/weather' },
    { label: t('nav.traders', 'Traders'), path: '/traders' },
    { label: t('nav.assistant', 'AI Assistant'), path: '/assistant' },
    { label: t('nav.about', 'About'), path: '/#about' }
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(2, 44, 34, 0.92)' : 'rgba(2, 44, 34, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#022c22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            🌿
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Farm<span style={{ color: '#10b981' }}>OS</span>
          </span>
        </Link>

        {/* Center: Main Navigation Links */}
        <nav className="hidden-mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path || (link.isHome && location.pathname === '/')

            return (
              <Link
                key={idx}
                to={link.path}
                style={{
                  color: isActive ? '#10b981' : '#e2e8f0',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                  paddingBottom: '2px'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Language + Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.78rem'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.65rem',
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
                color: language === 'hi' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                borderRadius: '16px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: language === 'hi' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>

          {/* User Auth Buttons */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard'}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  color: '#022c22',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                }}
              >
                Dashboard ➔
              </Link>
              <button
                onClick={handleLogout}
                className="hidden-mobile-nav"
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  color: '#022c22',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                }}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#10b981',
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#022c22',
          borderTop: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                padding: '0.35rem 0'
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
            {isAuthenticated && user ? (
              <>
                <Link
                  to={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.6rem',
                    backgroundColor: '#10b981',
                    color: '#022c22',
                    borderRadius: '8px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: '0.88rem'
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    borderRadius: '8px',
                    fontWeight: 700,
                    border: 'none',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.88rem'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.6rem',
                    backgroundColor: '#10b981',
                    color: '#022c22',
                    borderRadius: '8px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: '0.88rem'
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
