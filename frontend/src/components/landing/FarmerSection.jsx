import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const FarmerSection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      position: 'relative',
      padding: 'clamp(4rem, 10vw, 7rem) clamp(1rem, 4vw, 1.5rem)',
      backgroundImage: `linear-gradient(180deg, rgba(2, 44, 34, 0.85) 0%, rgba(2, 44, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <span style={{
          color: '#34d399',
          fontSize: '0.85rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'block',
          marginBottom: '0.75rem'
        }}>
          {t('landing.farmerShowcaseBadge', 'Empowering Indian Agriculture')}
        </span>

        <h2 style={{
          fontSize: 'clamp(1.8rem, 6vw, 3rem)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.2,
          letterSpacing: '-0.025em',
          marginBottom: '1.25rem'
        }}>
          {t('landing.farmerShowcaseTitle', 'Better Decisions. Better Markets. Better Opportunities.')}
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: '#cbd5e1',
          lineHeight: 1.6,
          maxWidth: '700px',
          margin: '0 auto 3rem'
        }}>
          {t('landing.farmerShowcaseSub', 'Transforming agricultural trade for farmers, aggregators, and wholesalers across West Bengal and India.')}
        </p>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: '1.5rem',
          backgroundColor: 'rgba(6, 78, 59, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '24px',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          backdropFilter: 'blur(12px)'
        }}>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', margin: 0 }}>500+</h3>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('landing.stat1Label', 'APMC Mandis Tracked')}
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', margin: 0 }}>₹0</h3>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('landing.stat2Label', 'Middleman Fees')}
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', margin: 0 }}>100%</h3>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('landing.stat3Label', 'Transparent Logistics')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
