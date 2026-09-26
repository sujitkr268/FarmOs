import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { Footer } from '../../components/Footer'
import './LandingPage.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

export const LandingPage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Opportunity Engine interactive demo form state
  const [demoCrop, setDemoCrop] = useState('Potato')
  const [demoQty, setDemoQty] = useState('500')
  const [demoLocation, setDemoLocation] = useState('Kolkata')

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    navigate(`/opportunities?crop=${encodeURIComponent(demoCrop)}&quantity=${encodeURIComponent(demoQty)}&location=${encodeURIComponent(demoLocation)}`)
  }

  const workflowSteps = [
    { step: '01', title: t('home.step1'), desc: t('home.step1Desc'), icon: '🌾' },
    { step: '02', title: t('home.step2'), desc: t('home.step2Desc'), icon: '📈' },
    { step: '03', title: t('home.step3'), desc: t('home.step3Desc'), icon: '⚖️' },
    { step: '04', title: t('home.step4'), desc: t('home.step4Desc'), icon: '🚚' },
    { step: '05', title: t('home.step5'), desc: t('home.step5Desc'), icon: '💰' },
    { step: '06', title: t('home.step6'), desc: t('home.step6Desc'), icon: '🏆' }
  ]

  const featureCards = [
    {
      id: 'mandi',
      icon: '📊',
      title: t('home.feature1Title'),
      subtitle: t('market.title'),
      badge: 'Agmarknet Integration',
      description: t('home.feature1Desc')
    },
    {
      id: 'comparison',
      icon: '⚖️',
      title: t('home.feature2Title'),
      subtitle: t('opportunity.title'),
      badge: 'Deterministic Ranking',
      description: t('home.feature2Desc')
    },
    {
      id: 'logistics',
      icon: '🚚',
      title: t('home.feature3Title'),
      subtitle: t('opportunity.logisticsTitle'),
      badge: 'OpenRouteService API',
      description: t('home.feature3Desc')
    },
    {
      id: 'buyers',
      icon: '🤝',
      title: t('home.feature4Title'),
      subtitle: t('opportunity.potentialBuyersTitle'),
      badge: 'Verified Directory',
      description: t('home.feature4Desc')
    },
    {
      id: 'assistant',
      icon: '🤖',
      title: t('home.feature5Title'),
      subtitle: t('assistant.title'),
      badge: 'Powered by Gemini AI',
      description: t('home.feature5Desc')
    }
  ]

  return (
    <div className="farmos-landing-wrapper">
      {/* 1. HERO SECTION */}
      <section className="ag-hero-section">
        <div className="ag-container">
          <div className="ag-hero-grid">
            {/* Left: Text & CTAs */}
            <motion.div
              className="ag-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="ag-badge ag-badge-emerald" style={{ marginBottom: '1rem' }}>
                "{t('home.heroBadge')}"
              </motion.div>

              <motion.h1 variants={fadeInUp} className="ag-heading-xl ag-hero-headline">
                {t('home.heroTitleLine1')} <br />
                <span style={{ color: '#0b3d2e' }}>{t('home.heroTitleLine2')}</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="ag-body-lg ag-hero-subtext">
                {t('home.heroDesc')}
              </motion.p>

              <motion.div variants={fadeInUp} className="ag-hero-actions">
                <Link to="/opportunities" className="ag-btn-primary">
                  <span>{t('home.exploreMarketplace')}</span>
                  <span>➔</span>
                </Link>
                <Link to="/market-prices" className="ag-btn-secondary">
                  <span>{t('home.getStartedFree')}</span>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="ag-hero-trust-bar">
                <span>{t('home.trustData')}</span>
                <span>{t('home.trustLogistics')}</span>
                <span>{t('home.trustAI')}</span>
              </motion.div>
            </motion.div>

            {/* Right: Realistic Dashboard Preview Card */}
            <motion.div
              className="ag-hero-mock-canvas"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="ag-mock-dashboard-preview">
                {/* Top Bar Sim */}
                <div className="ag-mock-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>🌿</div>
                    <strong style={{ fontSize: '0.95rem', color: '#0b3d2e' }}>FarmOS</strong>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10231b' }}>
                    {t('home.goodMorning', { name: 'Ramesh' })}
                  </div>
                </div>

                {/* Summary Stats Row */}
                <div className="ag-mock-stats-row">
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>{t('home.totalHarvests')}</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>4</strong>
                  </div>
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>{t('home.activeOrders')}</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>2</strong>
                  </div>
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>{t('home.sellingOpps')}</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>3</strong>
                  </div>
                  <div className="ag-mock-stat-pill" style={{ backgroundColor: '#dcfce7', borderColor: '#a7f3d0' }}>
                    <span style={{ fontSize: '0.68rem', color: '#166534', display: 'block' }}>{t('home.estNetReturn')}</span>
                    <strong style={{ fontSize: '1rem', color: '#0b3d2e' }}>₹24,680</strong>
                  </div>
                </div>

                {/* Best Market Opportunity Highlight Card */}
                <div className="ag-mock-opp-card">
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    •••••••• {t('home.bestOppHeader')} ••••••••
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b3d2e', margin: '0 0 0.2rem 0' }}>
                    Birbhum APMC
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#647d70', marginBottom: '0.75rem' }}>Potato</div>

                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10231b', marginBottom: '0.85rem' }}>
                    ₹2,400 <span style={{ fontSize: '0.85rem', color: '#647d70', fontWeight: 500 }}>{t('home.perQuintal')}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', backgroundColor: '#f4f8f5', padding: '0.65rem', borderRadius: '12px', fontSize: '0.78rem' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#166534', fontSize: '0.95rem' }}>₹8,042</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>{t('home.estNetReturn')}</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0b3d2e', fontSize: '0.95rem' }}>94/100</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>{t('home.colScore')}</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#10231b', fontSize: '0.95rem' }}>198 km</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>{t('home.distance')}</span>
                    </div>
                  </div>
                </div>

                {/* Mini Weather Widget */}
                <div className="ag-mock-weather-card">
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#10231b', display: 'block' }}>Kolkata</strong>
                    <span style={{ fontSize: '0.78rem', color: '#647d70' }}>Partly Cloudy 🌤️</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b3d2e' }}>28°C</span>
                    <div style={{ fontSize: '0.72rem', color: '#647d70' }}>💧 72% | 🌬️ 12 km/h</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ONE DECISION. MULTIPLE FACTORS SECTION */}
      <section className="ag-one-decision-section">
        <div className="ag-container">
          <div className="ag-decision-container">
            <h2 className="ag-heading-lg" style={{ marginBottom: '0.5rem' }}>
              {t('home.oneDecisionTitle')}
            </h2>
            <p className="ag-body-md" style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
              {t('home.oneDecisionDesc')}
            </p>

            <div className="ag-decision-flow-flex">
              <div className="ag-decision-item">{t('home.decPrice')}</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">{t('home.decDistance')}</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">{t('home.decFreight')}</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">{t('home.decWeather')}</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">{t('home.decBuyer')}</div>
              <span className="ag-decision-operator">↓</span>
              <div className="ag-decision-item highlight-net">{t('home.decNet')}</div>
              <span className="ag-decision-operator">↓</span>
              <div className="ag-decision-item highlight-best">{t('home.decBest')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FROM HARVEST TO OPPORTUNITY WORKFLOW */}
      <section className="ag-workflow-section">
        <div className="ag-container">
          <div className="ag-workflow-header">
            <h2 className="ag-heading-lg">{t('home.workflowTitle')}</h2>
            <p className="ag-body-md" style={{ marginTop: '0.5rem' }}>
              {t('home.workflowSub')}
            </p>
          </div>

          <div className="ag-workflow-grid">
            {workflowSteps.map((step, idx) => (
              <div className="ag-workflow-card" key={idx}>
                <div className="ag-workflow-node">{step.icon}</div>
                <div className="ag-workflow-title">{step.title}</div>
                <div className="ag-workflow-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPPORTUNITY ENGINE CENTERPIECE */}
      <section className="ag-engine-centerpiece-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <span className="ag-badge ag-badge-emerald">{t('home.coreEngineTitle')}</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>
              {t('home.coreEngineSub')}
            </h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              {t('home.oneDecisionDesc')}
            </p>
          </div>

          <div className="ag-engine-split">
            {/* Input Form Card */}
            <div className="ag-engine-input-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0b3d2e', marginBottom: '1.25rem' }}>
                {t('home.calculateOpps')}
              </h3>
              <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>{t('common.commodity')}</label>
                  <select value={demoCrop} onChange={(e) => setDemoCrop(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }}>
                    <option value="Potato">Potato</option>
                    <option value="Onion">Onion</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Rice">Rice</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>{t('common.quantity')} (kg)</label>
                  <input type="number" value={demoQty} onChange={(e) => setDemoQty(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>{t('home.yourLocation')}</label>
                  <input type="text" value={demoLocation} onChange={(e) => setDemoLocation(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }} />
                </div>

                <button type="submit" className="ag-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  {t('home.findOppsBtn')}
                </button>
              </form>
            </div>

            {/* Results Table Card */}
            <div className="ag-engine-table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0b3d2e', margin: 0 }}>
                  {t('home.demoResultTitle')}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#647d70', fontStyle: 'italic' }}>{t('home.demoResultSub')}</span>
              </div>

              <div className="table-responsive">
                <table className="ag-table">
                  <thead>
                    <tr>
                      <th>{t('home.colMarket')}</th>
                      <th>{t('home.colModalPrice')}</th>
                      <th>{t('home.colDistance')}</th>
                      <th>{t('home.colFreight')}</th>
                      <th>{t('home.colGrossValue')}</th>
                      <th>{t('home.colNetReturn')}</th>
                      <th>{t('home.colScore')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="best-row">
                      <td>
                        <strong style={{ color: '#0b3d2e', display: 'block' }}>1. Birbhum APMC</strong>
                        <span className="ag-badge ag-badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>{t('home.bestOppBadge')}</span>
                      </td>
                      <td>₹2,400</td>
                      <td>198 km</td>
                      <td>₹3,958</td>
                      <td>₹12,000</td>
                      <td><strong style={{ color: '#166534', fontSize: '1.05rem' }}>₹8,042</strong></td>
                      <td><span style={{ color: '#166534', fontWeight: 800, backgroundColor: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>94/100</span></td>
                    </tr>
                    <tr>
                      <td><strong>2. Burdwan APMC</strong></td>
                      <td>₹2,150</td>
                      <td>142 km</td>
                      <td>₹2,890</td>
                      <td>₹10,750</td>
                      <td><strong style={{ color: '#10231b' }}>₹7,860</strong></td>
                      <td><span style={{ color: '#0b3d2e', fontWeight: 700 }}>82/100</span></td>
                    </tr>
                    <tr>
                      <td><strong>3. Kolkata APMC</strong></td>
                      <td>₹1,980</td>
                      <td>28 km</td>
                      <td>₹1,240</td>
                      <td>₹9,900</td>
                      <td><strong style={{ color: '#10231b' }}>₹8,660</strong></td>
                      <td><span style={{ color: '#0b3d2e', fontWeight: 700 }}>68/100</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EVERYTHING FARMERS NEED TO MAKE BETTER DECISIONS */}
      <section className="ag-features-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <h2 className="ag-heading-lg">{t('home.featuresHeadline')}</h2>
          </div>

          <div className="ag-features-5grid">
            {featureCards.map((f) => (
              <div className="ag-feature-box" key={f.id}>
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#ebf3ed', color: '#0b3d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                    {f.icon}
                  </div>
                  <h3 className="ag-heading-sm" style={{ marginBottom: '0.35rem' }}>{f.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginBottom: '0.75rem' }}>{f.subtitle}</div>
                  <p className="ag-body-md">{f.description}</p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #e4eee7', fontSize: '0.78rem', color: '#647d70', fontWeight: 600 }}>
                  ✓ {f.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FARMOS ANYWHERE SHOWCASE & FOOTER BANNER */}
      <section className="ag-anywhere-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
            <span className="ag-badge ag-badge-light">Cross-Platform Responsive</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>{t('home.farmosAnywhereTitle')}</h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              {t('home.farmosAnywhereSub')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💻</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>{t('home.desktopExpTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>{t('home.desktopExpDesc')}</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>{t('home.mobileReadyTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>{t('home.mobileReadyDesc')}</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>{t('home.aiInterfaceTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>{t('home.aiInterfaceDesc')}</p>
            </div>
          </div>
        </div>

        {/* Deep Forest Green Banner */}
        <div className="ag-footer-banner">
          <div className="ag-container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
              "{t('home.tagline')}"
            </h2>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
              🌿 FarmOS
            </div>
            <p style={{ fontSize: '1rem', color: '#cde0d5', marginTop: '0.5rem' }}>
              "{t('home.taglineSub')}"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
