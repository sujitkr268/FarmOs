import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Determine active dashboard link target
  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'farmer') return '/farmer/dashboard'
    if (user.role === 'buyer') return '/buyer/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    return '/'
  }

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard'
    if (user.role === 'farmer') return 'Farmer Dashboard'
    if (user.role === 'buyer') return 'Buyer Dashboard'
    if (user.role === 'admin') return 'Admin Dashboard'
    return 'Dashboard'
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/buyer/marketplace' },
    { label: 'Mandi Prices', path: '/market-prices' },
    { label: 'Weather', path: '/weather' },
    { label: getDashboardLabel(), path: getDashboardPath() }
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(8, 10, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span style={{ color: '#ffffff' }}>Farm<span style={{ color: 'var(--accent-gold)' }}>OS</span></span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {navItems.map((item, idx) => {
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : item.path.includes('/dashboard') 
                ? location.pathname.includes('/dashboard')
                : location.pathname === item.path

            return (
              <Link
                key={idx}
                to={item.path}
                style={{
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
                  transition: 'color 0.2s'
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Desktop User Profile / Auth Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-auth">
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 0.85rem',
                borderRadius: '50px',
                fontSize: '0.82rem',
                color: 'var(--text-primary)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ fontWeight: 600 }}>{user.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--accent-gold-light)', textTransform: 'capitalize', fontWeight: 500 }}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" style={{
                padding: '0.45rem 1.15rem',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontWeight: 500,
                fontSize: '0.85rem'
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                padding: '0.45rem 1.15rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
                color: '#080a0e',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px var(--accent-gold-glow)'
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--accent-gold)',
            fontSize: '1.4rem'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0d1017',
          borderBottom: '1px solid var(--border-gold)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} className="mobile-drawer">
          {isAuthenticated && user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              marginBottom: '0.5rem'
            }}>
              <span>🧑‍🌾</span>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{user.name}</strong>
                <span style={{ color: 'var(--accent-gold-light)', fontSize: '0.78rem', textTransform: 'capitalize' }}>
                  {user.role} Portal
                </span>
              </div>
            </div>
          )}

          {navItems.map((item, idx) => {
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : item.path.includes('/dashboard') 
                ? location.pathname.includes('/dashboard')
                : location.pathname === item.path

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{item.label}</span>
                {isActive && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>
            )
          })}

          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(248, 81, 73, 0.15)',
                  border: '1px solid rgba(248, 81, 73, 0.3)',
                  color: '#f85149',
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                Logout
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.7rem',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
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
                    padding: '0.7rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
                    color: '#080a0e',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for Navbar Breakpoints */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-hamburger { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  )
}
