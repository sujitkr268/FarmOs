import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(8, 10, 14, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span style={{ color: '#ffffff' }}>Farm<span style={{ color: 'var(--accent-gold)' }}>OS</span></span>
        </Link>

        {/* Center: Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname === '/' ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            Home
          </Link>
          
          <Link
            to="/buyer/marketplace"
            style={{
              color: location.pathname === '/buyer/marketplace' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname === '/buyer/marketplace' ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            Marketplace
          </Link>

          <Link
            to="/market-prices"
            style={{
              color: location.pathname === '/market-prices' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname === '/market-prices' ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            Mandi Prices
          </Link>

          <Link
            to="/weather"
            style={{
              color: location.pathname === '/weather' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname === '/weather' ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            Weather
          </Link>

          <Link
            to="/assistant"
            style={{
              color: location.pathname === '/assistant' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname === '/assistant' ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span>🤖</span>
            <span>FarmOS Assistant</span>
          </Link>

          <Link
            to={getDashboardPath()}
            style={{
              color: location.pathname.includes('/dashboard') ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: location.pathname.includes('/dashboard') ? 600 : 500,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            {getDashboardLabel()}
          </Link>
        </nav>

        {/* Right: User Profile Pill / Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Reference User Profile Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 0.9rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(8px)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ fontWeight: 600 }}>{user.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--accent-gold-light)', textTransform: 'capitalize', fontWeight: 500 }}>
                  {user.role}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.2rem' }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" style={{
                padding: '0.45rem 1.25rem',
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
                padding: '0.45rem 1.25rem',
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
      </div>
    </header>
  )
}
