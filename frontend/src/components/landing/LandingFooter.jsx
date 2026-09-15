import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const LandingFooter = () => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <footer style={{
      backgroundColor: '#022c22',
      borderTop: '1px solid rgba(16, 185, 129, 0.2)',
      color: '#cbd5e1',
      padding: '4rem 1.5rem 2rem 1.5rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#10b981',
                color: '#022c22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 800
              }}>
                🌿
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Farm<span style={{ color: '#10b981' }}>OS</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Connecting Every Harvest to Its Best Opportunity. Empowering Indian farmers with data-driven market insights and smart freight calculations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Platform Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/market-prices" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Market Prices</Link></li>
              <li><Link to="/marketplace" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Marketplace</Link></li>
              <li><Link to="/weather" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Weather Intelligence</Link></li>
            </ul>
          </div>

          {/* Business & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Network & Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/traders" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Trader Directory</Link></li>
              <li><Link to="/assistant" style={{ color: '#cbd5e1', textDecoration: 'none' }}>FarmOS AI Assistant</Link></li>
              <li><a href="#about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About FarmOS</a></li>
              <li><a href="mailto:support@farmos.org" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact & Help</a></li>
            </ul>
          </div>

          {/* Language Options */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Language / भाषा</h4>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: language === 'en' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: language === 'en' ? '#022c22' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: language === 'hi' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: language === 'hi' ? '#022c22' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                हिंदी
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
              Government Agmarknet & OpenRouteService Enabled
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          fontSize: '0.82rem',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            © {new Date().getFullYear()} FarmOS AgTech Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>APMC Data Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
