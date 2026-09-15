import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export const Footer = () => {
  const { t } = useLanguage()

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
            {t('footer.tagline')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.home')}</Link></li>
            <li><Link to="/buyer/marketplace" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.marketplace')}</Link></li>
            <li><Link to="/traders" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.traderDirectory')}</Link></li>
            <li><Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.login')}</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.register')}</Link></li>
          </ul>
        </div>

        {/* Roles */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/farmer/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.farmerDashboard')}</Link></li>
            <li><Link to="/buyer/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.buyerDashboard')}</Link></li>
            <li><Link to="/admin/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('nav.adminDashboard')}</Link></li>
          </ul>
        </div>

        {/* Mission */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Government Data Integration</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            {t('footer.govDataDisclaimer')}
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
        &copy; {new Date().getFullYear()} FarmOS Platform. {t('footer.rights')}
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
