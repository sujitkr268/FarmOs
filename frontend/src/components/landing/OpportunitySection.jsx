import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export const OpportunitySection = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      backgroundColor: '#f7faf8',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {t('landing.oppBadge', 'Automated Profit Optimization')}
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.oppTitle', 'Best Opportunity Engine')}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.oppSub', 'Calculates exact net earnings after deducting logistics freight from live mandi rates.')}
          </p>
        </div>

        {/* Showcase Card */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #10b981',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>🥔</span>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#022c22', margin: 0 }}>
                  Potato
                </h3>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {t('landing.oppStockLabel', 'Stock Volume: 500 kg (5 Quintals)')}
                </span>
              </div>
            </div>

            <span style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '0.4rem 1rem',
              borderRadius: '30px',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}>
              {t('landing.oppTag', '★ BEST OPPORTUNITY')}
            </span>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
                {t('landing.oppBestMarket', 'Best Market')}
              </span>
              <strong style={{ fontSize: '1.15rem', color: '#022c22' }}>Birbhum APMC</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
                {t('landing.oppMarketPrice', 'Market Price')}
              </span>
              <strong style={{ fontSize: '1.15rem', color: '#022c22' }}>₹2,400 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ qtl</span></strong>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
                {t('landing.oppDistance', 'Distance')}
              </span>
              <strong style={{ fontSize: '1.15rem', color: '#022c22' }}>198 km</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
                {t('landing.oppFreightCost', 'Freight Cost')}
              </span>
              <strong style={{ fontSize: '1.15rem', color: '#ef4444' }}>₹3,958</strong>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#022c22',
            color: '#ffffff',
            borderRadius: '18px',
            padding: '1.5rem 2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>
                {t('landing.oppGrossRevenue', 'Gross Revenue')}
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#cbd5e1' }}>₹12,000</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.82rem', color: '#34d399', display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>
                {t('landing.oppEstNetReturn', '★ Estimated Net Return')}
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>₹8,042</span>
            </div>
          </div>

          {/* View Opportunity Link */}
          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <Link
              to="/marketplace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span>{t('landing.oppViewBtn', 'View Opportunity')}</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
