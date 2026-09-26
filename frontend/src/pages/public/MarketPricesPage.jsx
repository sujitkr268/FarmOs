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
        gap: '0.75rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem',
        flexWrap: 'wrap'
      }} className="tab-selector-bar">
        <button
          onClick={() => setActiveTab('mandi_prices')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'mandi_prices' ? '#10b981' : '#f8fafc',
            color: activeTab === 'mandi_prices' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: activeTab === 'mandi_prices' ? '1px solid #10b981' : '1px solid #cbd5e1',
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
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'analytics' ? '#10b981' : '#f8fafc',
            color: activeTab === 'analytics' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: activeTab === 'analytics' ? '1px solid #10b981' : '1px solid #cbd5e1',
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
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: activeTab === 'enam_info' ? '#10b981' : '#f8fafc',
            color: activeTab === 'enam_info' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: activeTab === 'enam_info' ? '1px solid #10b981' : '1px solid #cbd5e1',
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
