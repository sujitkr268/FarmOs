import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const MarketComparisonSection = () => {
  const { t } = useLanguage()

  const markets = [
    {
      name: 'Birbhum APMC',
      price: '₹2,400',
      distance: '198 km',
      freight: '₹3,958',
      gross: '₹12,000',
      net: '₹8,042',
      isBest: true,
      badge: t('landing.badgeBestOption', 'Best Option')
    },
    {
      name: 'Kolkata APMC',
      price: '₹2,250',
      distance: '85 km',
      freight: '₹1,800',
      gross: '₹11,250',
      net: '₹7,200',
      isBest: false,
      badge: t('landing.badgeGood', 'Good')
    },
    {
      name: 'Hooghly APMC',
      price: '₹2,100',
      distance: '42 km',
      freight: '₹1,100',
      gross: '₹10,500',
      net: '₹6,900',
      isBest: false,
      badge: t('landing.badgeModerate', 'Moderate')
    },
    {
      name: 'Burdwan APMC',
      price: '₹2,050',
      distance: '65 km',
      freight: '₹1,400',
      gross: '₹10,250',
      net: '₹6,800',
      isBest: false,
      badge: t('landing.badgeStandard', 'Standard')
    }
  ]

  return (
    <section style={{
      backgroundColor: '#ffffff',
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
            {t('landing.compareBadge', 'Multi-Mandi Analysis')}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.compareTitle', 'Compare Markets Before You Sell')}
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.compareSub', "A higher headline mandi rate doesn't always equal higher profit. FarmOS factors in freight transport costs.")}
          </p>
        </div>

        {/* Mandi Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1.5rem'
        }}>
          {markets.map((m, idx) => (
            <div key={idx} style={{
              backgroundColor: m.isBest ? '#f0fdf4' : '#f8fafc',
              border: m.isBest ? '2px solid #10b981' : '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: m.isBest ? '0 8px 30px rgba(16, 185, 129, 0.15)' : 'none',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#022c22', margin: 0 }}>
                    {m.name}
                  </h3>
                  <span style={{
                    backgroundColor: m.isBest ? '#10b981' : 'rgba(71, 85, 105, 0.1)',
                    color: m.isBest ? '#ffffff' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px'
                  }}>
                    {m.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#475569', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('landing.lblMarketRate', 'Market Rate:')}</span>
                    <strong style={{ color: '#022c22' }}>{m.price} / qtl</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('landing.lblDistance', 'Distance:')}</span>
                    <strong>{m.distance}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('landing.lblFreightCost', 'Freight Cost:')}</span>
                    <strong style={{ color: '#ef4444' }}>{m.freight}</strong>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: m.isBest ? '#022c22' : '#ffffff',
                border: '1px solid ' + (m.isBest ? '#10b981' : '#cbd5e1'),
                color: m.isBest ? '#ffffff' : '#022c22',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>
                  {t('landing.lblNetReturn', 'Net Return')}
                </span>
                <strong style={{ fontSize: '1.25rem', color: m.isBest ? '#34d399' : '#059669' }}>{m.net}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
