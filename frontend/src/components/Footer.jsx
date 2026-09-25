import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer style={{
      backgroundColor: '#0b2319',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f8fafc',
      padding: '4.5rem 1.5rem 2.5rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '3rem',
        marginBottom: '3.5rem'
      }}>
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 800
            }}>
              🌿
            </div>
            <span>Farm<span style={{ color: '#34d399' }}>OS</span></span>
          </div>
          <p style={{ color: '#cde0d5', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Connecting Every Harvest to Its Best Opportunity. Built to empower Indian farmers with mandi prices, freight logistics, and verified buyer discovery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li><Link to="/" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/market-prices" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>Market Prices</Link></li>
            <li><Link to="/marketplace" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>Opportunities</Link></li>
            <li><Link to="/traders" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>Traders & Buyers</Link></li>
            <li><Link to="/weather" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>Weather Intelligence</Link></li>
            <li><Link to="/assistant" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>FarmOS AI Assistant</Link></li>
          </ul>
        </div>

        {/* Platform Portals */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li><Link to="/farmer/dashboard" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>Farmer Dashboard</Link></li>
            <li><Link to="/buyer/dashboard" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>Buyer Portal</Link></li>
            <li><Link to="/login" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>Login Account</Link></li>
            <li><Link to="/register" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>Create Account</Link></li>
          </ul>
        </div>

        {/* Gov Data Disclaimer */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Governance</h4>
          <p style={{ color: '#94a89c', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Official Mandi price feeds are ingested directly from Government of India Agmarknet open data APIs. OpenRouteService computes driving distance & freight routes.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        paddingTop: '1.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        color: '#8fa598',
        fontSize: '0.88rem'
      }}>
        &copy; {new Date().getFullYear()} FarmOS AgTech Platform. All rights reserved.
      </div>
    </footer>
  )
}
