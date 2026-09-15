import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const AISection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      backgroundColor: '#064e3b',
      padding: '6rem 1.5rem',
      color: '#ffffff',
      borderTop: '1px solid rgba(16, 185, 129, 0.2)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 480px',
          gap: '3rem',
          alignItems: 'center'
        }} className="ai-section-grid">
          {/* Left Column: Text & Features */}
          <div>
            <span style={{
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              {t('landing.aiBadge', 'Gemini AI Powered')}
            </span>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}>
              {t('landing.aiTitle', 'Meet Your FarmOS AI Assistant')}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem' }}>
              {t('landing.aiSub', 'Ask about market prices, weather forecasts, crop advisory, transport logistics, verified buyers, and optimal selling opportunities in plain English or Hindi.')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', color: '#e2e8f0' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> {t('landing.aiCheck1', 'Real-Time Mandi Price Data Injection')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', color: '#e2e8f0' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> {t('landing.aiCheck2', 'Multilingual Voice & Text Support (English / हिंदी)')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', color: '#e2e8f0' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> {t('landing.aiCheck3', 'Automated Freight & Profit Comparisons')}
              </div>
            </div>

            <Link
              to="/assistant"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#10b981',
                color: '#022c22',
                fontWeight: 800,
                fontSize: '1rem',
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>{t('landing.aiAskBtn', 'Ask FarmOS AI')}</span>
              <span>➔</span>
            </Link>
          </div>

          {/* Right Column: AI Chat Preview Mockup */}
          <div>
            <div style={{
              backgroundColor: '#022c22',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Chat Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#022c22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  🤖
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {t('landing.aiHeaderTitle', 'FarmOS AI Assistant')}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                    {t('landing.aiHeaderStatus', '● Online & Ready')}
                  </span>
                </div>
              </div>

              {/* Chat Messages Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* User Message */}
                <div style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#10b981',
                  color: '#022c22',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px 16px 4px 16px',
                  maxWidth: '85%'
                }}>
                  {t('landing.aiDemoQ', 'Where should I sell my potato harvest today?')}
                </div>

                {/* AI Response */}
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px 16px 16px 4px',
                  lineHeight: 1.5,
                  maxWidth: '92%'
                }}>
                  {t('landing.aiDemoA', 'Based on current Mandi rates and logistics calculations, Birbhum APMC provides your highest net return (₹8,042 net margin) after deducting transport costs.')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ai-section-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
