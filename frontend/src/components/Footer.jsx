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
            {t('footer.taglineSub')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('footer.navigation')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li><Link to="/" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.home')}</Link></li>
            <li><Link to="/market-prices" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.mandiPrices')}</Link></li>
            <li><Link to="/opportunities" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.opportunities')}</Link></li>
            <li><Link to="/traders" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.traderDirectory')}</Link></li>
            <li><Link to="/weather" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.weather')}</Link></li>
            <li><Link to="/assistant" style={{ color: '#cde0d5', fontSize: '0.92rem', transition: 'color 0.2s' }}>{t('nav.assistant')}</Link></li>
          </ul>
        </div>

        {/* Platform Portals */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('footer.platformPortals')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li><Link to="/farmer/dashboard" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>{t('nav.farmerDashboard')}</Link></li>
            <li><Link to="/buyer/dashboard" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>{t('nav.buyerDashboard')}</Link></li>
            <li><Link to="/login" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>{t('nav.login')}</Link></li>
            <li><Link to="/register" style={{ color: '#cde0d5', fontSize: '0.92rem' }}>{t('nav.register')}</Link></li>
          </ul>
        </div>

        {/* Gov Data Disclaimer */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1.2rem', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('footer.dataGovernance')}
          </h4>
          <p style={{ color: '#94a89c', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {t('footer.govDataDetails')}
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
        &copy; {new Date().getFullYear()} {t('footer.platformTagline')}
      </div>
    </footer>
  )
}
