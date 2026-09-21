import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const TestimonialsSection = () => {
  const { t } = useLanguage()

  const scenarios = [
    {
      icon: '📊',
      tag: t('landing.scen1Tag', 'Scenario 01: Market Discovery'),
      title: t('landing.scen1Title', 'Mandi Price Comparison'),
      desc: t('landing.scen1Desc', 'Farmer compares mandi prices across regional APMCs before deciding where to list or transport produce, discovering higher net rates.')
    },
    {
      icon: '🚚',
      tag: t('landing.scen2Tag', 'Scenario 02: Logistics Analysis'),
      title: t('landing.scen2Title', 'Freight & Net Return Calculation'),
      desc: t('landing.scen2Desc', 'Farmer evaluates gross crop market rates against OpenRouteService freight transport costs to ensure maximum profit in hand.')
    },
    {
      icon: '🤝',
      tag: t('landing.scen3Tag', 'Scenario 03: Verified Network'),
      title: t('landing.scen3Title', 'Direct Buyer Discovery'),
      desc: t('landing.scen3Desc', 'Farmer discovers verified wholesalers, rice millers, and registered buyers directly through the transparent FarmOS directory.')
    }
  ]

  return (
    <section style={{
      backgroundColor: '#f7faf8',
      padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {t('landing.scenariosBadge', 'Illustrative Scenarios')}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.scenariosTitle', 'How FarmOS Empowers Decision Making')}
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.scenariosSub', 'Explore practical scenarios showing how mandi price comparisons and freight calculations maximize net profit.')}
          </p>
        </div>

        {/* Scenario Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '2rem'
        }}>
          {scenarios.map((s, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#e6f4ea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#059669',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px'
                  }}>
                    {s.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#022c22', marginBottom: '0.75rem' }}>
                  {s.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {s.desc}
                </p>
              </div>

              {/* Required Illustrative Scenario Notice */}
              <div style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span>ℹ️</span>
                <span>{t('landing.scenariosDisclaimer', 'Illustrative scenario • Not a real customer testimonial')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
