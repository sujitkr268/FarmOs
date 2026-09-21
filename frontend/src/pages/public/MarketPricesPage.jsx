import React, { useState } from 'react'
import { MandiPrices } from '../../components/MandiPrices'
import { EnamInfo } from '../../components/EnamInfo'
import { useLanguage } from '../../context/LanguageContext'

export const MarketPricesPage = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('mandi_prices')

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      color: '#f3f4f6'
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 60%, #06120c 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        marginBottom: '1.75rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          📈 Mandi Price Intelligence
        </h1>
        <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 600 }}>
          {t('market.subtitle')}
        </p>
      </div>

      {/* Tab Selector Header */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.75rem',
        backgroundColor: '#0f2218',
        padding: '0.4rem',
        borderRadius: '14px',
        border: '1px solid rgba(31, 64, 46, 0.8)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('mandi_prices')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'mandi_prices' ? '#10b981' : 'transparent',
            color: activeTab === 'mandi_prices' ? '#06120c' : '#9ca3af',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            flex: 1,
            minWidth: '160px'
          }}
        >
          📊 Live Mandi Market Prices
        </button>

        <button
          onClick={() => setActiveTab('enam_info')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'enam_info' ? '#10b981' : 'transparent',
            color: activeTab === 'enam_info' ? '#06120c' : '#9ca3af',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            flex: 1,
            minWidth: '160px'
          }}
        >
          🏛️ e-NAM Trade Reference
        </button>
      </div>

      {activeTab === 'mandi_prices' ? (
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
          <MandiPrices />
        </div>
      ) : (
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
          <EnamInfo />
        </div>
      )}
    </div>
  )
}

export default MarketPricesPage
