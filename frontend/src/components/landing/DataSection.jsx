import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const DataSection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      backgroundColor: '#022c22',
      padding: '6rem 1.5rem',
      color: '#ffffff',
      borderTop: '1px solid rgba(16, 185, 129, 0.2)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {t('landing.dataSectionBadge', 'Real-Time Intelligence')}
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.dataSectionTitle', 'Data. AI. Better Opportunities.')}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.dataSectionSub', 'Live government APMC feeds, OpenRouteService freight calculations, and AI insights synthesized into one unified dashboard.')}
          </p>
        </div>

        {/* Dashboard Mockup Container */}
        <div style={{
          backgroundColor: '#064e3b',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Mockup Top Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: '0.5rem', fontWeight: 600 }}>
                {t('landing.dataPreviewHeader', 'FarmOS Intelligence Engine • Real-Time Live Preview')}
              </span>
            </div>

            <span style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: '20px'
            }}>
              {t('landing.dataConnectedBadge', '🟢 Connected to APMC Mandis & OpenRouteService')}
            </span>
          </div>

          {/* Mockup Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* Stat Card 1 */}
            <div style={{
              backgroundColor: 'rgba(2, 44, 34, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('landing.dataCard1Label', 'Crop & Stock Volume')}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0.3rem 0' }}>
                Potato (500 kg)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                {t('landing.dataCard1Cat', 'Category: Fresh Produce')}
              </span>
            </div>

            {/* Stat Card 2 */}
            <div style={{
              backgroundColor: 'rgba(2, 44, 34, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('landing.dataCard2Label', 'Best Ranked Market')}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', margin: '0.3rem 0' }}>
                Birbhum APMC
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Rate: ₹2,400 / quintal
              </span>
            </div>

            {/* Stat Card 3 */}
            <div style={{
              backgroundColor: 'rgba(2, 44, 34, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('landing.dataCard3Label', 'Logistics & Freight')}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0.3rem 0' }}>
                198 km (₹3,958)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Gross: ₹12,000
              </span>
            </div>

            {/* Stat Card 4 */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                {t('landing.dataCard4Label', '★ Estimated Net Return')}
              </span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', margin: '0.3rem 0' }}>
                ₹8,042
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>
                {t('landing.dataCard4Sub', 'Highest Net Margin')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
