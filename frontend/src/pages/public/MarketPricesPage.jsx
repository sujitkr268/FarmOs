import React, { useState } from 'react'
import { MandiPrices } from '../../components/MandiPrices'
import { EnamInfo } from '../../components/EnamInfo'
import { useLanguage } from '../../context/LanguageContext'

export const MarketPricesPage = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('mandi_prices') // 'mandi_prices' | 'enam_info'

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.5rem 1rem',
      color: 'var(--text-primary)'
    }} className="market-prices-page">
      {/* Tab Selector Header */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        flexWrap: 'wrap'
      }} className="tab-selector-bar">
        <button
          onClick={() => setActiveTab('mandi_prices')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'mandi_prices' ? '#0b2319' : '#ffffff',
            color: activeTab === 'mandi_prices' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: activeTab === 'mandi_prices' ? '1px solid #0b2319' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1,
            minWidth: '200px'
          }}
        >
          📊 {t('market.title')}
        </button>

        <button
          onClick={() => setActiveTab('enam_info')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'enam_info' ? '#0b2319' : '#ffffff',
            color: activeTab === 'enam_info' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: activeTab === 'enam_info' ? '1px solid #0b2319' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1,
            minWidth: '200px'
          }}
        >
          🏛️ e-NAM Market Information
        </button>
      </div>

      {activeTab === 'mandi_prices' ? <MandiPrices /> : <EnamInfo />}

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
