import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const HeroSection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '7.5rem 1.5rem 5rem 1.5rem',
      backgroundImage: `linear-gradient(180deg, rgba(2, 44, 34, 0.72) 0%, rgba(2, 44, 34, 0.92) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 420px',
        gap: '3rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }} className="hero-grid">
        {/* Left Column: Headline & Action Buttons */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.45rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <span>🌱</span>
            <span>{t('landing.heroBadge', 'Smart Farming • Better Markets • Better Returns')}</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1.5rem',
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
            fontSize: '1.2rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '650px',
            marginBottom: '2.5rem'
          }}>
            {t('landing.heroDesc', 'FarmOS helps farmers compare markets, calculate transport costs, discover potential buyers and make better selling decisions.')}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/register"
              style={{
                padding: '0.95rem 2.25rem',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#022c22',
                fontWeight: 800,
                fontSize: '1.05rem',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
              className="hero-primary-btn"
            >
              <span>{t('landing.getStarted', 'Get Started')}</span>
              <span>➔</span>
            </Link>

            <Link
              to="/marketplace"
              style={{
                padding: '0.95rem 2.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.05rem',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease'
              }}
            >
              {t('landing.explore', 'Explore FarmOS')}
            </Link>
          </div>
        </div>

        {/* Right Column: Floating Glassmorphism Decision Card */}
        <div>
          <div style={{
            backgroundColor: 'rgba(6, 78, 59, 0.45)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '24px',
            padding: '2.25rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {t('landing.smarterDecisions', 'Smarter Decisions')}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#34d399' }}>
                  {t('landing.mandiAnalyticsSub', 'Real-time Mandi & Freight Analytics')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.compareMarkets', 'Compare Markets')}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {t('landing.liveApmcBench', 'Live APMC price benchmarks')}
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🚚</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.calcLogistics', 'Calculate Logistics')}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {t('landing.distFreightDeduct', 'Distance & freight cost deduction')}
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 34, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🤝</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {t('landing.findBuyers', 'Find Better Buyers')}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {t('landing.verifiedWholesalers', 'Verified wholesalers & APMCs')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-title {
            font-size: 2.3rem !important;
          }
        }
        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.95rem !important;
          }
          .hero-primary-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  )
}
