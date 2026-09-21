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
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const navLinks = [
    { label: t('nav.home', 'Home'), path: '/', isHome: true },
    { label: t('nav.marketPrices', 'Market Prices'), path: '/market-prices' },
    { label: t('nav.marketplace', 'Marketplace'), path: '/marketplace' },
    { label: t('nav.weather', 'Weather'), path: '/weather' },
    { label: t('nav.traders', 'Traders'), path: '/traders' },
    { label: t('nav.assistant', 'AI Assistant'), path: '/assistant' }
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '60px',
      backgroundColor: scrolled ? 'rgba(2, 44, 34, 0.95)' : 'rgba(2, 44, 34, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 clamp(16px, 3vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#022c22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.15rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            fontWeight: 800
          }}>
            🌿
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Farm<span style={{ color: '#10b981' }}>OS</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

        {/* Right Tools: Language + Auth / Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Language Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '2px',
            fontSize: '0.75rem'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? '#10b981' : 'transparent',
                color: language === 'en' ? '#022c22' : '#cbd5e1',
                border: 'none',
                borderRadius: '16px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? '#10b981' : 'transparent',
                color: language === 'hi' ? '#022c22' : '#cbd5e1',
                border: 'none',
                borderRadius: '16px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="desktop-auth-btns" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isAuthenticated && user ? (
              <>
                <Link
                  to={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard'}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    color: '#022c22',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  Dashboard ➔
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.45rem 0.8rem',
                    borderRadius: '8px',
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
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    color: '#022c22',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#10b981',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 998
            }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            maxWidth: '82vw',
            backgroundColor: '#022c22',
            borderRight: '1px solid rgba(16, 185, 129, 0.3)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem 1rem',
            animation: 'slideInLeft 0.2s ease-out'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#10b981', color: '#022c22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>🌿</div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Farm<span style={{ color: '#10b981' }}>OS</span></span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {navLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color: location.pathname === item.path ? '#10b981' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: location.pathname === item.path ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '0.65rem',
                      backgroundColor: '#10b981',
                      color: '#022c22',
                      borderRadius: '10px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    Dashboard ➔
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.65rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      borderRadius: '10px',
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
                      padding: '0.65rem',
                      backgroundColor: '#10b981',
                      color: '#022c22',
                      borderRadius: '10px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontSize: '0.88rem'
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav-links, .desktop-auth-btns { display: none !important; }
          .mobile-hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

export default LandingNavbar
