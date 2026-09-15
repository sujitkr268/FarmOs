import React, { useState, useEffect } from 'react'
import { getMarketPrices } from '../api/marketApi'
import { useLanguage } from '../context/LanguageContext'

export const MandiPrices = () => {
  const { t } = useLanguage()
  // Filter states with defaults: West Bengal & Potato
  const [stateFilter, setStateFilter] = useState('West Bengal')
  const [commodityFilter, setCommodityFilter] = useState('Potato')
  const [districtFilter, setDistrictFilter] = useState('')
  
  // Data & UI states
  const [marketData, setMarketData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch prices from backend API
  const fetchPrices = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (stateFilter.trim()) params.state = stateFilter.trim()
      if (commodityFilter.trim()) params.commodity = commodityFilter.trim()
      if (districtFilter.trim()) params.district = districtFilter.trim()
      params.limit = 12

      const response = await getMarketPrices(params)

      if (response && response.success) {
        setMarketData(response.data || [])
        setTotalCount(response.total || response.count || (response.data ? response.data.length : 0))
      } else {
        setMarketData([])
        setError('Failed to load Mandi market prices.')
      }
    } catch (err) {
      console.error('Fetch Mandi Prices Error:', err)
      const msg = err.response?.data?.message || err.message || 'Unable to connect to FarmOS backend server.'
      setError(`Unable to retrieve Mandi prices: ${msg}`)
      setMarketData([])
    } finally {
      setLoading(false)
    }
  }

  // Load default data on initial component mount
  useEffect(() => {
    fetchPrices()
  }, [])

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchPrices()
  }

  // Quick reset to default Potato / West Bengal
  const handleResetFilters = () => {
    setStateFilter('West Bengal')
    setCommodityFilter('Potato')
    setDistrictFilter('')
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Component Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(17, 21, 28, 0.95) 100%)',
        border: '1px solid var(--border-gold)',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📈</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('market.title')}
            </h2>
            <span style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Govt of India Agmarknet
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            {t('market.subtitle')}
          </p>
        </div>

        <button
          onClick={fetchPrices}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filter Controls Bar */}
      <form onSubmit={handleSearchSubmit} style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'end'
      }}>
        {/* State Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {t('common.state')}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. West Bengal, Punjab"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Commodity Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {t('common.commodity')}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Potato, Onion, Rice"
            value={commodityFilter}
            onChange={(e) => setCommodityFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* District Filter (Optional) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {t('common.district')}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Nadia, Hooghly"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '0.68rem 1rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
              color: '#080a0e',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px var(--accent-gold-glow)'
            }}
          >
            🔍 {t('common.search')}
          </button>
          
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.68rem 0.9rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.85rem'
            }}
          >
            {t('common.resetFilters')}
          </button>
        </div>
      </form>

      {/* Error Alert State */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          color: '#f87171',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{t('common.error')}</strong>
            <span style={{ fontSize: '0.88rem' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s infinite linear' }}>⏳</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            {t('common.loading')}
          </h3>
        </div>
      ) : marketData.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌾</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {t('market.noPricesFound')}
          </h3>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold-light)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            {t('common.resetFilters')}
          </button>
        </div>
      ) : (
        /* Mandi Price Records Grid */
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            padding: '0 0.5rem'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{marketData.length}</strong> mandi market records
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Prices in <strong>₹/quintal</strong> (100 kg)
            </span>
          </div>

          <div className="mandi-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {marketData.map((item, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}>
                <div>
                  {/* Top Bar: Crop Name & Variety */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {item.commodity}
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', fontWeight: 500 }}>
                        {t('market.variety')}: {item.variety || 'Standard'} ({t('market.grade')}: {item.grade || 'FAQ'})
                      </span>
                    </div>
                    
                    <span style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      📅 {item.arrival_date || 'Today'}
                    </span>
                  </div>

                  {/* Location Info: Market, District, State */}
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      🏛️ {t('common.mandi')}: {item.market}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      📍 {item.district}, {item.state}
                    </div>
                  </div>

                  {/* Modal Price Highlight Box */}
                  <div style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {t('market.modalPrice')}
                      </span>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                        ₹{Number(item.modal_price).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                        / quintal
                      </span>
                    </div>

                    <span style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      color: 'var(--accent-gold-light)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '20px'
                    }}>
                      Benchmark Rate
                    </span>
                  </div>

                  {/* Min / Max Price Range */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.6rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px'
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{t('market.minPrice')}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹{Number(item.min_price).toLocaleString()}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / quintal</span>
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px'
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{t('market.maxPrice')}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹{Number(item.max_price).toLocaleString()}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / quintal</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          .mandi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
