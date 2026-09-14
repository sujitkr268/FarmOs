import React from 'react'
import { MandiPrices } from '../../components/MandiPrices'

export const MarketPricesPage = () => {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)'
    }}>
      <MandiPrices />
    </div>
  )
}
