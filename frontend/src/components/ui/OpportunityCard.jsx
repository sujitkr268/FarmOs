import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const OpportunityCard = ({ data, onViewClick }) => {
  const { t } = useLanguage()

  if (!data) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.75rem' }}>
        <div style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>
          {t('opportunity.noCalculated')}
        </div>
      </div>
    )
  }

  const bestMarket = data.recommended || data.best_opportunity || (data.opportunities && data.opportunities[0]) || {}

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '1.75rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e6f4ea', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            🌱
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {t('opportunity.bestForYourHarvest')}
          </h2>
        </div>
        <span style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '0.3rem 0.75rem',
          borderRadius: '20px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {t('home.bestOppBadge')}
        </span>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {/* Crop Illustration Image */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '16px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          flexShrink: 0
        }}>
          🥔
        </div>

        {/* Info Items */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
              {data.crop || 'Potato'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {data.quantity || '500'} {data.unit || 'kg'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.recommendedMarket')}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              📍 {bestMarket.market || 'Birbhum APMC'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('common.price')}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
              ₹{bestMarket.price ? Number(bestMarket.price).toLocaleString() : '2,400'} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('home.perQuintal')}</span>
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('home.distance')}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              🚗 {bestMarket.distance || '198 km'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.travelTime')}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              ⏱️ {bestMarket.travel_time || '2h 41m'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Strip (Light Emerald Box) */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('home.colFreight')}</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>
              ₹{bestMarket.freight ? Number(bestMarket.freight).toLocaleString() : '3,958'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.estGrossValue')}</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>
              ₹{bestMarket.gross_revenue ? Number(bestMarket.gross_revenue).toLocaleString() : '12,000'}
            </span>
          </div>

          {/* Highlighted Net Return */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>{t('opportunity.estNetReturn')}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
              ₹{bestMarket.net_return ? Number(bestMarket.net_return).toLocaleString() : '8,042'}
            </span>
          </div>
        </div>

        {onViewClick && (
          <button
            onClick={onViewClick}
            style={{
              padding: '0.65rem 1.35rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {t('common.viewDetails')} →
          </button>
        )}
      </div>
    </div>
  )
}
