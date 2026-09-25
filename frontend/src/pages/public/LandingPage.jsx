import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import './LandingPage.css'

// Animation Variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

export const LandingPage = () => {
  const { t } = useLanguage()

  const workflowSteps = [
    { step: '01', title: 'Harvest', desc: 'Register crop stock & quantity', icon: '🌾' },
    { step: '02', title: 'Mandi Prices', desc: 'Fetch live Agmarknet rates', icon: '📊' },
    { step: '03', title: 'Market Comparison', desc: 'Compare regional APMCs', icon: '⚖️' },
    { step: '04', title: 'Freight Calculation', desc: 'Compute road distance & rates', icon: '🚚' },
    { step: '05', title: 'Net Return', desc: 'Optimize net revenue after freight', icon: '₹' },
    { step: '06', title: 'Best Opportunity', desc: 'Connect with verified buyers', icon: '🏆' }
  ]

  const featureCards = [
    {
      id: 'mandi',
      icon: '📊',
      title: 'Live Mandi Market Prices',
      badge: 'Agmarknet Integration',
      description: 'Ingests official Government of India Agmarknet data. Filter by state, district, market, commodity, variety, and grade with min, max, and modal prices per quintal.',
      demoItem: {
        crop: 'Potato (FAQ Grade)',
        market: 'Kolkata APMC, West Bengal',
        modalPrice: '₹2,100 / quintal',
        arrivalDate: 'Today'
      }
    },
    {
      id: 'comparison',
      icon: '⚖️',
      title: 'Smart Market Comparison',
      badge: 'Deterministic Ranking',
      description: 'Evaluates candidate mandis simultaneously. Ranks selling destinations by estimated gross return, price consistency ratio, and FarmOS Opportunity Score (0–100).',
      demoItem: {
        bestMarket: 'Birbhum APMC (Score: 94/100)',
        runnerUp: 'Burdwan APMC (Score: 88/100)',
        baseline: 'Kolkata APMC (Score: 82/100)'
      }
    },
    {
      id: 'logistics',
      icon: '🚚',
      title: 'Smart Freight Logistics',
      badge: 'OpenRouteService API',
      description: 'Computes real road driving distances and travel times. Auto-selects vehicle types (Mini Truck, Canter, Multi-Axle) and calculates exact freight costs.',
      demoItem: {
        route: '198 km • approx 2h 41m',
        vehicle: 'Mini Truck (Tata Ace / Bolero)',
        estFreight: '₹3,958 total transport cost'
      }
    },
    {
      id: 'buyers',
      icon: '🤝',
      title: 'Potential Buyer Discovery',
      badge: 'Verified Directory',
      description: 'Find matching wholesalers, millers, and verified FarmOS registered buyers based on commodity requirements, buying capacity, and location proximity.',
      demoItem: {
        buyer: 'AgriTrade Foods & Mills',
        location: 'Kolkata, West Bengal',
        status: '🟢 FarmOS Verified Business'
      }
    },
    {
      id: 'assistant',
      icon: '💬',
      title: 'AI Farm Assistant',
      badge: 'Powered by Gemini AI',
      description: 'Conversational advisor powered by Google Gemini. The backend calculates factual market/logistics data first, and Gemini explains recommendations in simple terms.',
      demoItem: {
        query: '"Which mandi gives me maximum net income for 500kg Potato?"',
        aiOutput: '"Birbhum APMC yields highest net return of ₹8,042 after ₹3,958 freight."'
      }
    }
  ]

  const buyerListings = [
    {
      name: 'AgriTrade Foods & Processing Ltd',
      type: 'Wholesaler & Processor',
      location: 'Kolkata, West Bengal',
      commodities: 'Potato, Basmati Rice, Paddy',
      capacity: '10,000 kg / week',
      status: '🟢 FarmOS Verified Business',
      evidence: 'Source verified via APEDA & WBSAMB'
    },
    {
      name: 'GreenHarvest Milling Co.',
      type: 'Rice Miller & Exporter',
      location: 'Burdwan, West Bengal',
      commodities: 'Paddy, Rice, Pulses',
      capacity: '25,000 kg / month',
      status: '🔵 FarmOS Registered Buyer',
      evidence: 'Verified Udyam MSME Account'
    },
    {
      name: 'FreshMart Trading Co.',
      type: 'APMC License Wholesaler',
      location: 'Howrah, West Bengal',
      commodities: 'Potato, Onion, Tomato',
      capacity: '5,000 kg / week',
      status: '🌐 Public Business Info',
      evidence: 'Website Verified Business Profile'
    }
  ]

  return (
    <div className="farmos-landing-wrapper">
      {/* 1. HERO SECTION */}
      <section className="ag-hero-section">
        <div className="ag-hero-bg-media">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
            alt="Lush Agricultural Farmland"
          />
        </div>
        <div className="ag-hero-overlay" />

        <div className="ag-container">
          <div className="ag-hero-grid">
            {/* Left: Headline & Actions */}
            <motion.div
              className="ag-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="ag-badge ag-badge-emerald">
                🌱 Premium Agricultural Technology Platform
              </motion.div>

              <motion.h1 variants={fadeInUp} className="ag-heading-xl ag-hero-headline">
                Connecting Every Harvest <br />
                <span>to Its Best Opportunity</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="ag-body-lg ag-hero-subtext">
                Compare mandi prices, estimate transport costs, calculate net returns, and discover potential buyers from one intelligent agricultural platform.
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
            </motion.div>

            {/* Right: Floating Interactive Data Cards */}
            <motion.div
              className="ag-hero-visual-stack"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Card 1: Best Opportunity Floating Card */}
              <motion.div
                className="ag-glass-card"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span className="ag-opp-badge">🏆 Best Market Opportunity</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a89c' }}>Demo Data</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.3rem 0' }}>
                  Birbhum APMC Mandi
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#cde0d5', margin: '0 0 1rem 0' }}>
                  West Bengal • Distance: 198 km
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a89c', display: 'block' }}>Benchmark Price</span>
                    <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>₹2,400 <span style={{ fontSize: '0.75rem', color: '#34d399' }}>/qtl</span></strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a89c', display: 'block' }}>Est. Net Return</span>
                    <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>₹8,042</strong>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cde0d5' }}>
                  <span>FarmOS Opportunity Score</span>
                  <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>94 / 100</strong>
                </div>
              </motion.div>

              {/* Card 2: Weather Data Floating Card */}
              <motion.div
                className="ag-glass-card"
                style={{ alignSelf: 'flex-end', maxWidth: '320px', width: '100%' }}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a89c', display: 'block' }}>Kolkata, West Bengal</span>
                    <strong style={{ fontSize: '1.4rem', color: '#ffffff' }}>28°C</strong>
                    <span style={{ fontSize: '0.8rem', color: '#34d399', marginLeft: '0.5rem' }}>Partly Cloudy 🌤️</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cde0d5', textAlign: 'right' }}>
                    <div>💧 72% Hum.</div>
                    <div>🌬️ 12 km/h</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. HOW FARMOS WORKS SECTION */}
      <section className="ag-process-section">
        <div className="ag-container">
          <motion.div
            className="ag-process-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            <div className="ag-process-header">
              <span className="ag-badge ag-badge-light">Transparent Workflow</span>
              <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>How FarmOS Works</h2>
              <p className="ag-body-md" style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                Simple, data-driven decision pipeline from harvest registration to selling execution.
              </p>
            </div>

            <div className="ag-process-flow-desktop">
              {workflowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="ag-process-step">
                    <div className="ag-step-node">{step.icon}</div>
                    <div className="ag-step-title">{step.title}</div>
                    <div className="ag-step-subtitle">{step.desc}</div>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="ag-process-arrow">➔</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE FARMOS FEATURES */}
      <section className="ag-features-section">
        <div className="ag-container">
          <motion.div
            className="ag-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="ag-badge ag-badge-light">Comprehensive Intelligence</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>
              Built for Modern Agricultural Decisions
            </h2>
            <p className="ag-body-lg" style={{ marginTop: '0.75rem' }}>
              FarmOS bridges crop production and market realization with real-time data feeds and calculated net returns.
            </p>
          </motion.div>

          <motion.div
            className="ag-features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {featureCards.map((feat) => (
              <motion.div key={feat.id} variants={fadeInUp} className="ag-feature-card">
                <div>
                  <div className="ag-feature-icon-box">{feat.icon}</div>
                  <span className="ag-badge ag-badge-light" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                    {feat.badge}
                  </span>
                  <h3 className="ag-heading-sm" style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                    {feat.title}
                  </h3>
                  <p className="ag-body-md">{feat.description}</p>
                </div>

                <div className="ag-feature-demo-box">
                  <div style={{ fontSize: '0.72rem', color: 'var(--ag-text-light)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    System Product Showcase
                  </div>
                  {Object.entries(feat.demoItem).map(([k, v], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.2rem 0', color: 'var(--ag-text-dark)' }}>
                      <span style={{ color: 'var(--ag-text-muted)', textTransform: 'capitalize' }}>{k}:</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. OPPORTUNITY ENGINE SECTION */}
      <section className="ag-engine-section">
        <div className="ag-container">
          <div className="ag-engine-grid">
            {/* Left: Explanation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="ag-badge ag-badge-emerald">Core Decision Engine</span>
              <h2 className="ag-heading-lg" style={{ color: '#ffffff', margin: '1rem 0' }}>
                Find the opportunity behind every harvest.
              </h2>
              <p style={{ color: '#cde0d5', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                The FarmOS Opportunity Engine evaluates reported mandi prices, calculates road distance using OpenRouteService, auto-selects vehicle logistics, and ranks selling destinations by <strong>Estimated Net Return</strong>.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ borderLeft: '3px solid var(--ag-emerald)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>PRICE</div>
                  <span style={{ fontSize: '0.8rem', color: '#94a89c' }}>Modal Benchmark</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--ag-emerald)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>FREIGHT</div>
                  <span style={{ fontSize: '0.8rem', color: '#94a89c' }}>Road Transport</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--ag-emerald)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ag-emerald-bright)' }}>NET RETURN</div>
                  <span style={{ fontSize: '0.8rem', color: '#94a89c' }}>Real Profit</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Decision Flow Visual Card */}
            <motion.div
              className="ag-engine-flow-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Farmer Harvest: 500 kg Potato
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a89c' }}>Illustrative Demo Evaluation</span>
              </div>

              {/* Market A */}
              <div className="ag-market-opt-row best-opt">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ color: '#ffffff', fontSize: '1rem' }}>Market A (Birbhum APMC)</strong>
                    <span className="ag-opp-badge">Top Return</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#cde0d5' }}>₹2,450/qtl • 84 km • Freight: ₹1,680</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a89c' }}>Estimated Net Return</div>
                  <strong style={{ fontSize: '1.15rem', color: '#34d399' }}>₹10,570</strong>
                </div>
              </div>

              {/* Market B */}
              <div className="ag-market-opt-row">
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '1rem' }}>Market B (Burdwan APMC)</strong>
                  <div style={{ fontSize: '0.8rem', color: '#cde0d5' }}>₹2,380/qtl • 62 km • Freight: ₹1,420</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a89c' }}>Estimated Net Return</div>
                  <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>₹10,480</strong>
                </div>
              </div>

              {/* Market C */}
              <div className="ag-market-opt-row">
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '1rem' }}>Market C (Kolkata APMC)</strong>
                  <div style={{ fontSize: '0.8rem', color: '#cde0d5' }}>₹2,520/qtl • 140 km • Freight: ₹2,600</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a89c' }}>Estimated Net Return</div>
                  <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>₹9,700</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FARMOS ANYWHERE SHOWCASE */}
      <section className="ag-anywhere-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="ag-badge ag-badge-light">Designed for Every Screen</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>FarmOS Anywhere</h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              Everything a farmer needs, directly from the field. Responsive experience tailored for Desktop, Tablet, and Mobile.
            </p>
          </div>

          <div className="ag-preview-cards-grid">
            {/* Screen 1: Farmer Dashboard UI */}
            <motion.div
              className="ag-device-mockup-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📱</span>
                <h3 className="ag-heading-sm">Farmer Dashboard</h3>
              </div>
              <p className="ag-body-md">Post harvests, review active orders, check weather, and monitor estimated net earnings.</p>

              <div className="ag-mobile-screen-sim">
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginBottom: '0.5rem' }}>🌾 Active Harvest: Potato 500kg</div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800 }}>Top Mandi: Birbhum APMC</div>
                <div style={{ fontSize: '0.75rem', color: '#94a89c' }}>Est. Return: ₹8,042 (Score: 94/100)</div>
              </div>
            </motion.div>

            {/* Screen 2: Mandi Prices Directory UI */}
            <motion.div
              className="ag-device-mockup-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📊</span>
                <h3 className="ag-heading-sm">Live Mandi Prices</h3>
              </div>
              <p className="ag-body-md">Instant search across Government Agmarknet databases with state and district filters.</p>

              <div className="ag-mobile-screen-sim">
                <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>🔍 Search: West Bengal APMCs</div>
                <div style={{ fontSize: '0.82rem', color: '#34d399' }}>Modal: ₹2,100 / qtl • Arrival Today</div>
                <div style={{ fontSize: '0.75rem', color: '#94a89c' }}>Min: ₹1,950 | Max: ₹2,250</div>
              </div>
            </motion.div>

            {/* Screen 3: FarmOS AI Assistant UI */}
            <motion.div
              className="ag-device-mockup-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🤖</span>
                <h3 className="ag-heading-sm">FarmOS AI Assistant</h3>
              </div>
              <p className="ag-body-md">Get instant conversational explanations of market rankings and weather forecasts.</p>

              <div className="ag-mobile-screen-sim">
                <div style={{ fontSize: '0.75rem', color: '#94a89c', marginBottom: '0.3rem' }}>User: "Where should I sell my harvest?"</div>
                <div style={{ fontSize: '0.78rem', color: '#ffffff', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.4rem', borderRadius: '8px' }}>
                  Gemini: "Birbhum APMC offers highest net profit of ₹8,042 after deducting ₹3,958 transport cost."
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. WEATHER + AI SECTION */}
      <section className="ag-weather-ai-section">
        <div className="ag-container">
          <div className="ag-weather-ai-grid">
            {/* Left: Weather Widget Card */}
            <motion.div
              style={{ backgroundColor: 'var(--ag-cream-card)', border: '1px solid var(--ag-border-subtle)', borderRadius: 'var(--ag-radius-lg)', padding: '2.5rem', boxShadow: 'var(--ag-shadow-md)' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <span className="ag-badge ag-badge-light">Open-Meteo Integration</span>
                  <h3 className="ag-heading-md" style={{ marginTop: '0.5rem' }}>Hyper-Local Weather Intelligence</h3>
                </div>
                <span style={{ fontSize: '2.5rem' }}>🌤️</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--ag-cream-section)', padding: '1.25rem', borderRadius: 'var(--ag-radius-md)', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ag-text-muted)', display: 'block' }}>Kolkata, WB</span>
                  <strong style={{ fontSize: '2rem', color: 'var(--ag-text-dark)' }}>28°C</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ag-text-body)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div>💧 Humidity: <strong>72%</strong></div>
                  <div>🌬️ Wind Speed: <strong>12 km/h</strong></div>
                  <div>🌧️ Rain Sum: <strong>0.0 mm</strong></div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--ag-text-muted)' }}>
                Includes 15-minute in-memory backend caching for rate limit protection and rapid response times.
              </div>
            </motion.div>

            {/* Right: AI Explanation Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="ag-badge ag-badge-light">Explanation Layer</span>
              <h2 className="ag-heading-lg" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
                Context-Aware AI Guidance
              </h2>
              <p className="ag-body-lg" style={{ marginBottom: '1.5rem' }}>
                FarmOS backend services calculate factual market numbers, vehicle rates, and weather forecasts first. Google Gemini AI acts as the conversational explanation layer to translate raw metrics into friendly advice.
              </p>

              <div style={{ backgroundColor: 'var(--ag-mint-light)', border: '1px solid var(--ag-border-subtle)', borderRadius: 'var(--ag-radius-md)', padding: '1.25rem' }}>
                <strong style={{ color: 'var(--ag-emerald-dark)', display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  💡 Factual Integrity Rule:
                </strong>
                <p style={{ fontSize: '0.86rem', color: 'var(--ag-text-body)', margin: 0 }}>
                  Gemini is strictly instructed to explain calculated context and never hallucinates market prices or transport rates independently.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. BUYER DISCOVERY SECTION */}
      <section className="ag-buyers-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <span className="ag-badge ag-badge-light">Direct Trade Network</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>Verified Agricultural Buyers & Directory</h2>
            <p className="ag-body-lg" style={{ marginTop: '0.5rem' }}>
              Connect with legitimate agricultural businesses, rice millers, APMC functionaries, and voluntary FarmOS-registered buyers.
            </p>
          </div>

          <motion.div
            className="ag-buyer-cards-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {buyerListings.map((b, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="ag-feature-card">
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ag-emerald-dark)', fontWeight: 700, marginBottom: '0.35rem' }}>{b.status}</div>
                  <h3 className="ag-heading-sm" style={{ marginBottom: '0.25rem' }}>{b.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ag-text-muted)', marginBottom: '1rem' }}>{b.type} • 📍 {b.location}</div>

                  <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.85rem', borderRadius: 'var(--ag-radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    <div><strong>Commodities:</strong> {b.commodities}</div>
                    <div><strong>Capacity:</strong> {b.capacity}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--ag-text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--ag-border-light)', paddingTop: '0.75rem' }}>
                  {b.evidence}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. FARMER + BUYER DASHBOARDS PREVIEW */}
      <section className="ag-dashboards-section">
        <div className="ag-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <span className="ag-badge ag-badge-light">Role-Based Workspaces</span>
            <h2 className="ag-heading-lg" style={{ marginTop: '0.5rem' }}>Purpose-Built Dashboards for Farmers & Buyers</h2>
          </div>

          <div className="ag-dashboard-preview-split">
            {/* Farmer Workspace Preview */}
            <motion.div
              style={{ backgroundColor: 'var(--ag-cream-card)', border: '1px solid var(--ag-border-subtle)', borderRadius: 'var(--ag-radius-lg)', padding: '2.25rem', boxShadow: 'var(--ag-shadow-md)' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.6rem' }}>🧑‍🌾</span>
                <h3 className="ag-heading-md">Farmer Portal</h3>
              </div>
              <p className="ag-body-md" style={{ marginBottom: '1.5rem' }}>
                Post crop harvests, evaluate market opportunity rankings, review incoming purchase orders, track weather, and talk to FarmOS AI.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>🌾 Harvest CRUD</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>🎯 Opportunity Engine</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>📦 Order Status Approval</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>🛡️ Farmer Trust Badge</div>
              </div>

              <Link to="/register" className="ag-btn-outline" style={{ width: '100%' }}>
                <span>Register as Farmer</span>
              </Link>
            </motion.div>

            {/* Buyer Workspace Preview */}
            <motion.div
              style={{ backgroundColor: 'var(--ag-cream-card)', border: '1px solid var(--ag-border-subtle)', borderRadius: 'var(--ag-radius-lg)', padding: '2.25rem', boxShadow: 'var(--ag-shadow-md)' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.6rem' }}>🏢</span>
                <h3 className="ag-heading-md">Buyer Portal</h3>
              </div>
              <p className="ag-body-md" style={{ marginBottom: '1.5rem' }}>
                Browse direct farmer produce listings, place purchase orders, track procurement statuses, and manage e-NAM / Udyam references.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>🛒 Direct Order Placement</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>📦 Order Fulfillment Tracking</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>📈 Mandi Directory</div>
                <div style={{ backgroundColor: 'var(--ag-cream-section)', padding: '0.75rem', borderRadius: '10px' }}>🛡️ Buyer Trust Credentials</div>
              </div>

              <Link to="/register" className="ag-btn-outline" style={{ width: '100%' }}>
                <span>Register as Buyer</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
