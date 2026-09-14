import React, { useState } from 'react'
import { MandiPrices } from '../../components/MandiPrices'
import { EnamInfo } from '../../components/EnamInfo'

export const MarketPricesPage = () => {
  const [activeTab, setActiveTab] = useState('mandi_prices') // 'mandi_prices' | 'enam_info'

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)'
    }}>
      {/* Tab Selector Header */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setActiveTab('mandi_prices')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'mandi_prices' ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'mandi_prices' ? '#080a0e' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📊 Live Govt Mandi Prices
        </button>

        <button
          onClick={() => setActiveTab('enam_info')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'enam_info' ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'enam_info' ? '#080a0e' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🏛️ e-NAM Market Information
        </button>
      </div>

      {activeTab === 'mandi_prices' ? <MandiPrices /> : <EnamInfo />}
    </div>
  )
}
