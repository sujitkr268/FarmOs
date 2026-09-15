import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const HowFarmOSWorks = () => {
  const { t } = useLanguage()

  const steps = [
    { num: '01', title: t('landing.step1Title', 'Harvest'), desc: t('landing.step1Desc', 'Register crop stock details'), icon: '🌾' },
    { num: '02', title: t('landing.step2Title', 'Market Prices'), desc: t('landing.step2Desc', 'Fetch live Mandi prices'), icon: '📈' },
    { num: '03', title: t('landing.step3Title', 'Opportunity Analysis'), desc: t('landing.step3Desc', 'Evaluate net margins'), icon: '🧠' },
    { num: '04', title: t('landing.step4Title', 'Smart Logistics'), desc: t('landing.step4Desc', 'Calculate transport costs'), icon: '🚚' },
    { num: '05', title: t('landing.step5Title', 'Potential Buyers'), desc: t('landing.step5Desc', 'Connect with verified buyers'), icon: '🤝' },
    { num: '06', title: t('landing.step6Title', 'Better Decision'), desc: t('landing.step6Desc', 'Maximize harvest revenue'), icon: '💰' }
  ]

  return (
    <section style={{
      backgroundColor: '#ffffff',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {t('landing.workflowBadge', 'Simple 6-Step Workflow')}
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.workflowTitle', 'How FarmOS Works')}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.workflowSub', 'From field harvest to final deal — a streamlined process for maximum profit.')}
          </p>
        </div>

        {/* Process Flow Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{
              backgroundColor: '#f7faf8',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '1.75rem 1.25rem',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              {/* Step Badge */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                {s.num}
              </div>

              <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{s.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#022c22', marginBottom: '0.4rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
