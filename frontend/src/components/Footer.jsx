import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#06070a',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 1.5rem 2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span style={{ color: '#ffffff' }}>Farm<span style={{ color: 'var(--accent-gold)' }}>OS</span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Connecting Every Harvest to Its Best Opportunity. Modern, transparent, and direct agricultural marketplace.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Home</Link></li>
            <li><Link to="/buyer/marketplace" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Marketplace</Link></li>
            <li><Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign In</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Register Account</Link></li>
          </ul>
        </div>

        {/* Roles */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/farmer/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Farmer Dashboard</Link></li>
            <li><Link to="/buyer/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Buyer Dashboard</Link></li>
            <li><Link to="/admin/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Mission */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Agriculture</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Engineered for Smart India Hackathon. Direct farmer-to-buyer connectivity and transparent harvest management.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        &copy; {new Date().getFullYear()} FarmOS Platform. All rights reserved.
      </div>

      <style>{`
        @media (max-width: 600px) {
          footer {
            padding: 2.5rem 1rem 1.5rem 1rem !important;
          }
        }
      `}</style>
    </footer>
  )
}
