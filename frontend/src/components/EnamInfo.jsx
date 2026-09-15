import React, { useState, useEffect } from 'react'
import { getEnamInfo } from '../api/enamApi'

export const EnamInfo = () => {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getEnamInfo()
        if (response && response.success) {
          setInfo(response)
        } else {
          setError('Failed to load e-NAM platform information.')
        }
      } catch (err) {
        console.error('Fetch e-NAM Info Error:', err)
        const msg = err.response?.data?.message || err.message || 'Unable to connect to FarmOS backend server.'
        setError(`Unable to load e-NAM market information: ${msg}`)
      } finally {
        setLoading(false)
      }
    }

    fetchInfo()
  }, [])

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s infinite linear' }}>⏳</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Loading e-NAM Market Information...
        </h3>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        color: '#f87171',
        marginBottom: '2rem'
      }}>
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(17, 21, 28, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.4rem' }}>🏛️</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                e-NAM Market Information
              </h2>
              <span style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                National Agriculture Market (enam.gov.in)
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 0.5rem 0', maxWidth: '800px' }}>
              {info?.overview}
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🏛️ Managed by: {info?.agency}
            </span>
          </div>

          <a
            href={info?.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            🌐 Open enam.gov.in ↗
          </a>
        </div>
      </div>

      {/* Official Government Resource Links */}
      <div className="enam-resource-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <a
          href={info?.mandiDirectoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📍</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>APMC Mandi Directory</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Search official e-NAM onboarded mandis ↗</span>
          </div>
        </a>

        <a
          href={info?.tradeDashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📈</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Official Trade Dashboard</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View e-NAM portal trading reports ↗</span>
          </div>
        </a>

        <a
          href={info?.farmerRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🧑‍🌾</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>Farmer Registration</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Official e-NAM portal registration ↗</span>
          </div>
        </a>
      </div>

      {/* Core Platform Advantages Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        ✨ Core Advantages of Trading on e-NAM
      </h3>

      <div className="enam-adv-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {info?.keyFeatures?.map((feat, idx) => (
          <div key={idx} style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.35rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: 0, marginBottom: '0.4rem' }}>
              {feat.title}
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {feat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Step-by-Step Farmer Trade Workflow */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        📋 How Farmers Trade Produce on e-NAM Mandis
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        {info?.tradeWorkflowSteps?.map((stepItem) => (
          <div key={stepItem.step} style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.1rem 1.4rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              flexShrink: 0
            }}>
              {stepItem.step}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                {stepItem.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                {stepItem.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Best Selling Strategy Advisor Card */}
      <div style={{
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        border: '1px solid var(--border-gold)',
        borderRadius: '18px',
        padding: '1.5rem 1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)', margin: 0 }}>
            FarmOS Best Selling Strategy Guide
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
          1. 📊 Check <strong>Live Mandi Prices</strong> on FarmOS to know the current baseline benchmark rate (₹/quintal) in your state.<br />
          2. 🏛️ Search the official <strong>e-NAM Mandi Directory</strong> to locate e-NAM onboarded APMC mandis near you.<br />
          3. 🌾 Compare with <strong>Direct Buyer Offers</strong> on the FarmOS Direct Farmer Harvests marketplace for maximum net earnings.
        </p>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'block' }}>
          📌 Note: e-NAM electronic trading is conducted exclusively through licensed APMC mandis and official portal enam.gov.in.
        </span>
      </div>

      <style>{`
        @media (max-width: 550px) {
          .enam-resource-grid, .enam-adv-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
