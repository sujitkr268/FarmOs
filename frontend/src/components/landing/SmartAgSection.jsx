import React from 'react'

export const SmartAgSection = () => {
  const cards = [
    {
      title: 'Market Intelligence',
      desc: 'Real-time Mandi market rates across APMCs to compare commodity prices state-wide.',
      icon: '📊',
      badge: 'APMC Live Rates'
    },
    {
      title: 'Smart Logistics',
      desc: 'Accurate transport cost calculation based on distance, quantity, and vehicle type.',
      icon: '🚚',
      badge: 'Freight Calculator'
    },
    {
      title: 'Best Opportunities',
      desc: 'Automated ranking engine calculating actual net earnings after all transport costs.',
      icon: '🏆',
      badge: 'Profit Engine'
    },
    {
      title: 'Potential Buyers',
      desc: 'Direct access to verified agricultural wholesalers, rice millers, and APMC traders.',
      icon: '🤝',
      badge: 'Verified Buyers'
    },
    {
      title: 'Weather Intelligence',
      desc: '7-day localized agricultural weather forecasts to optimize harvesting and shipping.',
      icon: '🌤️',
      badge: 'Open-Meteo API'
    },
    {
      title: 'FarmOS AI',
      desc: 'Gemini AI assistant offering instant guidance on market prices, crops, and agronomy.',
      icon: '🤖',
      badge: 'Gemini AI'
    }
  ]

  return (
    <section style={{
      backgroundColor: '#f7faf8',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Core Features
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Smart Agriculture. Better Decisions.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            Empowering Indian farmers with data-driven market insights and smart logistics tools.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {cards.map((c, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }} className="feature-card-hover">
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#e6f4ea',
                    color: '#064e3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem'
                  }}>
                    {c.icon}
                  </div>
                  <span style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#059669',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px'
                  }}>
                    {c.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#022c22', marginBottom: '0.6rem' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .feature-card-hover:hover {
          transform: translateY(-4px);
          border-color: #10b981 !important;
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.12) !important;
        }
      `}</style>
    </section>
  )
}
