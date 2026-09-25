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
    navigate(`/marketplace?crop=${encodeURIComponent(demoCrop)}&quantity=${encodeURIComponent(demoQty)}&location=${encodeURIComponent(demoLocation)}`)
  }

  const workflowSteps = [
    { step: '01', title: '1. Harvest', desc: 'Track details', icon: '🌾' },
    { step: '02', title: '2. Market Prices', desc: 'Get real-time mandi prices', icon: '📈' },
    { step: '03', title: '3. Market Comparison', desc: 'Compare markets', icon: '⚖️' },
    { step: '04', title: '4. Logistics', desc: 'Estimate costs & routes', icon: '🚚' },
    { step: '05', title: '5. Net Return', desc: 'Calculate final profit', icon: '💰' },
    { step: '06', title: '6. Best Opportunity', desc: 'Find right market & buyer', icon: '🏆' }
  ]

  const featureCards = [
    {
      id: 'mandi',
      icon: '📊',
      title: 'Live Mandi Market Prices',
      subtitle: 'Real-time data',
      badge: 'Agmarknet Integration',
      description: 'Official Government of India Agmarknet feeds. Filter by state, district, market, commodity, and grade with min, max, and modal prices per quintal.'
    },
    {
      id: 'comparison',
      icon: '⚖️',
      title: 'Smart Market Comparison',
      subtitle: 'Comparison analysis',
      badge: 'Deterministic Ranking',
      description: 'Ranks regional APMCs simultaneously by estimated gross return, distance, transport cost, and FarmOS Opportunity Score (0–100).'
    },
    {
      id: 'logistics',
      icon: '🚚',
      title: 'Smart Freight Logistics',
      subtitle: 'Distance, vehicle select',
      badge: 'OpenRouteService API',
      description: 'Calculates real road driving distances and travel times. Auto-selects vehicle types (Mini Truck, Canter, Multi-Axle) and exact freight cost.'
    },
    {
      id: 'buyers',
      icon: '🤝',
      title: 'Potential Buyer Discovery',
      subtitle: 'Traders & buyers',
      badge: 'Verified Directory',
      description: 'Connect with wholesalers, millers, and verified FarmOS registered buyers matching your commodity specs and volume.'
    },
    {
      id: 'assistant',
      icon: '🤖',
      title: 'AI Farm Assistant',
      subtitle: 'Agricultural guidance with Gemini AI',
      badge: 'Powered by Gemini AI',
      description: 'Conversational assistant explaining market trends, logistics calculations, and weather advisories in simple language.'
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
                "Smart Agriculture • Better Markets • Higher Returns"
              </motion.div>

              <motion.h1 variants={fadeInUp} className="ag-heading-xl ag-hero-headline">
                Connecting Every Harvest <br />
                <span style={{ color: '#0b3d2e' }}>to Its Best Opportunity</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="ag-body-lg ag-hero-subtext">
                FarmOS helps farmers discover better market opportunities by combining real mandi prices, logistics costs, weather intelligence and buyer discovery.
              </motion.p>

              <motion.div variants={fadeInUp} className="ag-hero-actions">
                <Link to="/marketplace" className="ag-btn-primary">
                  <span>Explore Opportunities</span>
                  <span>➔</span>
                </Link>
                <Link to="/market-prices" className="ag-btn-secondary">
                  <span>View Market Prices</span>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="ag-hero-trust-bar">
                <span>☑ Real Market Data</span>
                <span>☑ Smart Logistics</span>
                <span>☑ AI Powered Assistant</span>
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
                    Good morning, Ramesh! 👋
                  </div>
                </div>

                {/* Summary Stats Row */}
                <div className="ag-mock-stats-row">
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>Total Harvests</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>4</strong>
                  </div>
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>Active Orders</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>2</strong>
                  </div>
                  <div className="ag-mock-stat-pill">
                    <span style={{ fontSize: '0.7rem', color: '#647d70', display: 'block' }}>Selling Opps</span>
                    <strong style={{ fontSize: '1.05rem', color: '#10231b' }}>3</strong>
                  </div>
                  <div className="ag-mock-stat-pill" style={{ backgroundColor: '#dcfce7', borderColor: '#a7f3d0' }}>
                    <span style={{ fontSize: '0.68rem', color: '#166534', display: 'block' }}>Est. Net Return</span>
                    <strong style={{ fontSize: '1rem', color: '#0b3d2e' }}>₹24,680</strong>
                  </div>
                </div>

                {/* Best Market Opportunity Highlight Card */}
                <div className="ag-mock-opp-card">
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    •••••••• BEST MARKET OPPORTUNITY ••••••••
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b3d2e', margin: '0 0 0.2rem 0' }}>
                    Birbhum APMC
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#647d70', marginBottom: '0.75rem' }}>Potato</div>

                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10231b', marginBottom: '0.85rem' }}>
                    ₹2,400 <span style={{ fontSize: '0.85rem', color: '#647d70', fontWeight: 500 }}>/ quintal</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', backgroundColor: '#f4f8f5', padding: '0.65rem', borderRadius: '12px', fontSize: '0.78rem' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#166534', fontSize: '0.95rem' }}>₹8,042</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>Est. Net Return</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0b3d2e', fontSize: '0.95rem' }}>94/100</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>Opp Score</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#10231b', fontSize: '0.95rem' }}>198 km</strong>
                      <span style={{ color: '#647d70', fontSize: '0.7rem' }}>Distance</span>
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
              One Decision. Multiple Factors.
            </h2>
            <p className="ag-body-md" style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
              FarmOS combines multiple real-world factors to help farmers evaluate where their harvest may create the best opportunity.
            </p>

            <div className="ag-decision-flow-flex">
              <div className="ag-decision-item">🏷️ Market Price</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">📍 Distance</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">🚚 Freight Cost</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">🌤️ Weather</div>
              <span className="ag-decision-operator">+</span>
              <div className="ag-decision-item">🤝 Buyer Availability</div>
              <span className="ag-decision-operator">↓</span>
              <div className="ag-decision-item highlight-net">💰 NET RETURN</div>
              <span className="ag-decision-operator">↓</span>
              <div className="ag-decision-item highlight-best">🏆 BEST OPPORTUNITY</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FROM HARVEST TO OPPORTUNITY WORKFLOW */}
      <section className="ag-workflow-section">
        <div className="ag-container">
          <div className="ag-workflow-header">
            <h2 className="ag-heading-lg">From Harvest to Opportunity</h2>
            <p className="ag-body-md" style={{ marginTop: '0.5rem' }}>
              A complete ecosystem to help farmers make better selling decisions.
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
            <span className="ag-badge ag-badge-emerald">Core Decision Engine</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>
              Find Where Your Harvest Can Earn More.
            </h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              Compare market prices, logistics costs and estimated net returns in one place.
            </p>
          </div>

          <div className="ag-engine-split">
            {/* Input Form Card */}
            <div className="ag-engine-input-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0b3d2e', marginBottom: '1.25rem' }}>
                Calculate Opportunities
              </h3>
              <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Commodity</label>
                  <select value={demoCrop} onChange={(e) => setDemoCrop(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }}>
                    <option value="Potato">Potato</option>
                    <option value="Onion">Onion</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Rice">Rice</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Quantity (kg)</label>
                  <input type="number" value={demoQty} onChange={(e) => setDemoQty(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Your Location</label>
                  <input type="text" value={demoLocation} onChange={(e) => setDemoLocation(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #d6e4db', backgroundColor: '#f7faf8' }} />
                </div>

                <button type="submit" className="ag-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Find Opportunities
                </button>
              </form>
            </div>

            {/* Results Table Card */}
            <div className="ag-engine-table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0b3d2e', margin: 0 }}>
                  Multimarket Comparison Result
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#647d70', fontStyle: 'italic' }}>Demonstration Comparison</span>
              </div>

              <div className="table-responsive">
                <table className="ag-table">
                  <thead>
                    <tr>
                      <th>Market</th>
                      <th>Modal Price</th>
                      <th>Distance</th>
                      <th>Freight</th>
                      <th>Gross Value</th>
                      <th>Net Return</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="best-row">
                      <td>
                        <strong style={{ color: '#0b3d2e', display: 'block' }}>1. Birbhum APMC</strong>
                        <span className="ag-badge ag-badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>Best Opportunity</span>
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
            <h2 className="ag-heading-lg">Everything Farmers Need to Make Better Decisions</h2>
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
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>FarmOS Anywhere</h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              Access your farm, markets and opportunities from any device.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💻</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>Desktop Experience</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>Full analytical dashboard with multi-market side-by-side table comparisons.</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>Mobile & Field Ready</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>Touch-optimized cards for fast mandi price checks right from the farm field.</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0b3d2e' }}>AI Assistant Interface</h3>
              <p style={{ fontSize: '0.85rem', color: '#647d70', marginTop: '0.35rem' }}>Ask Gemini AI about market trends, transport costs, and weather forecasts anytime.</p>
            </div>
          </div>
        </div>

        {/* Deep Forest Green Banner */}
        <div className="ag-footer-banner">
          <div className="ag-container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
              "Smarter Decisions. Better Harvests."
            </h2>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
              🌿 FarmOS
            </div>
            <p style={{ fontSize: '1rem', color: '#cde0d5', marginTop: '0.5rem' }}>
              "Connecting Every Harvest to Its Best Opportunity"
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
