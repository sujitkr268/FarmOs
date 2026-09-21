import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const FinalCTA = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      position: 'relative',
      padding: 'clamp(4rem, 10vw, 7rem) clamp(1rem, 4vw, 1.5rem)',
      backgroundImage: `linear-gradient(180deg, rgba(2, 44, 34, 0.88) 0%, rgba(2, 44, 34, 0.95) 100%), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 6vw, 3.2rem)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          marginBottom: '1.25rem'
        }} className="cta-heading">
          {t('landing.finalCtaTitlePrefix', 'Your Harvest Deserves the')}{' '}
          <span style={{ color: '#10b981' }}>{t('landing.finalCtaTitleHighlight', 'Best Opportunity')}</span>.
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: '#cbd5e1',
          lineHeight: 1.6,
          maxWidth: '650px',
          margin: '0 auto 2.5rem'
        }}>
          {t('landing.finalCtaSub', 'Make smarter market decisions with FarmOS. Compare mandi prices, calculate logistics freight, and connect directly with buyers.')}
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              backgroundColor: '#10b981',
              color: '#022c22',
              fontWeight: 800,
              fontSize: '1.05rem',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{t('landing.finalCtaBtnPrimary', 'Get Started Free')}</span>
            <span>➔</span>
          </Link>

          <Link
            to="/marketplace"
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)'
            }}
          >
            {t('landing.finalCtaBtnSecondary', 'Explore FarmOS')}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .cta-heading { font-size: 2.2rem !important; }
        }
      `}</style>
    </section>
  )
}
