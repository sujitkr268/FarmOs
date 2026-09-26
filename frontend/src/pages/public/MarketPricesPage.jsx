import React, { useState } from 'react'
import { MandiPrices } from '../../components/MandiPrices'
import { EnamInfo } from '../../components/EnamInfo'
import { MarketAnalyticsSection } from '../../components/analytics/MarketAnalyticsSection'
import { useLanguage } from '../../context/LanguageContext'

export const MarketPricesPage = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('mandi_prices') // 'mandi_prices' | 'analytics' | 'enam_info'

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.5rem 1rem',
      color: 'var(--text-primary)'
    }} className="market-prices-page">

      {/* Page Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {t('market.title')}
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          {t('market.subtitle')}
        </p>
      </div>

      {/* Tab Selector Header */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        backgroundColor: '#ebf3ed',
        border: '1px solid #d6e4db',
        borderRadius: '16px',
        padding: '5px',
        flexWrap: 'wrap'
      }} className="tab-selector-bar">
        <button
          onClick={() => setActiveTab('mandi_prices')}
          style={{
            padding: '0.7rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'mandi_prices' ? '#0b3d2e' : 'transparent',
            color: activeTab === 'mandi_prices' ? '#ffffff' : '#647d70',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            boxShadow: activeTab === 'mandi_prices' ? '0 4px 12px rgba(11, 35, 25, 0.1)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1,
            minWidth: '180px'
          }}
        >
          📈 Mandi Prices & Benchmark Rates
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '0.7rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'analytics' ? '#0b3d2e' : 'transparent',
            color: activeTab === 'analytics' ? '#ffffff' : '#647d70',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(11, 35, 25, 0.1)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1,
            minWidth: '180px'
          }}
        >
          📊 Visual Market Analytics
        </button>

        <button
          onClick={() => setActiveTab('enam_info')}
          style={{
            padding: '0.7rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'enam_info' ? '#0b3d2e' : 'transparent',
            color: activeTab === 'enam_info' ? '#ffffff' : '#647d70',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            boxShadow: activeTab === 'enam_info' ? '0 4px 12px rgba(11, 35, 25, 0.1)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1,
            minWidth: '180px'
          }}
        >
          🏛️ e-NAM Market Information
        </button>
      </div>

      {activeTab === 'mandi_prices' && <MandiPrices />}
      {activeTab === 'analytics' && <MarketAnalyticsSection cropName="Potato" quantity={2000} unit="kg" />}
      {activeTab === 'enam_info' && <EnamInfo />}

      <style>{`
        @media (max-width: 480px) {
          .market-prices-page {
            padding: 1rem 0.5rem !important;
          }
          .tab-selector-bar button {
            min-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MarketPricesPage
