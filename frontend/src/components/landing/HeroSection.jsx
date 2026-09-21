import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const HeroSection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      position: 'relative',
      minHeight: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(80px, 12vw, 120px) clamp(16px, 4vw, 32px) clamp(32px, 6vw, 64px) clamp(16px, 4vw, 32px)',
      backgroundImage: `linear-gradient(180deg, rgba(2, 44, 34, 0.78) 0%, rgba(2, 44, 34, 0.94) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#ffffff',
      overflow: 'hidden'
    }} className="landing-hero-container">
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: 'clamp(1.5rem, 4vw, 3rem)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }} className="hero-responsive-grid">
        {/* Left Column: Headline & Action Buttons */}
        <div>
          {/* FarmOS Branding Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.4rem 0.95rem',
            borderRadius: '30px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <span>🌱</span>
            <span>{t('landing.heroBadge', 'Smart Farming • Better Markets • Better Returns')}</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
            color: '#ffffff'
          }} className="hero-title">
            {t('landing.heroTitlePrefix', 'Connecting Every Harvest to Its')}{' '}
            <span style={{
              color: '#10b981',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('landing.heroTitleHighlight', 'Best Opportunity')}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '650px',
            marginBottom: '1.75rem'
          }}>
            {t('landing.heroDesc', 'FarmOS helps farmers compare markets, calculate transport costs, discover potential buyers and make better selling decisions.')}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }} className="hero-cta-group">
            <Link
              to="/register"
              style={{
                height: '46px',
                padding: '0 1.75rem',
                borderRadius: '10px',
                backgroundColor: '#10b981',
                color: '#022c22',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              className="hero-primary-cta"
            >
              <span>{t('landing.getStarted', 'Get Started')}</span>
              <span>➔</span>
            </Link>

            <Link
              to="/marketplace"
              style={{
                height: '44px',
                padding: '0 1.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hero-secondary-cta"
            >
              {t('landing.explore', 'Explore FarmOS')}
            </Link>
          </div>
        </div>

        {/* Right Column: Floating Glassmorphism Decision Card */}
        <div style={{ width: '100%', minWidth: 0 }}>
          <div style={{
            backgroundColor: 'rgba(6, 78, 59, 0.55)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '20px',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                flexShrink: 0
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                  {t('landing.smarterDecisions', 'Smart Decisions')}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                  {t('landing.mandiAnalyticsSub', 'Real-time Mandi & Freight Analytics')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                minHeight: '64px'
              }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>📊</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.compareMarkets', 'Compare Markets')}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                    {t('landing.liveApmcBench', 'Live APMC price benchmarks')}
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                minHeight: '64px'
              }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🚚</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.calcLogistics', 'Calculate Logistics')}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                    {t('landing.distFreightDeduct', 'Distance & freight cost deduction')}
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                minHeight: '64px'
              }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🤝</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.findBuyers', 'Find Better Buyers')}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                    {t('landing.verifiedWholesalers', 'Verified wholesalers & APMCs')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1280px) {
          .landing-hero-container {
            min-height: 720px !important;
          }
        }
        @media (max-width: 1024px) {
          .hero-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-primary-cta, .hero-secondary-cta {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
