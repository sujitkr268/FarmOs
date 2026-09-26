import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { Footer } from '../../components/Footer'
import './LandingPage.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
}

export const LandingPage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Demo opportunity filter parameters
  const [demoCrop, setDemoCrop] = useState('Potato')
  const [demoQty, setDemoQty] = useState('2000')
  const [demoLocation, setDemoLocation] = useState('West Bengal')

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    navigate(`/opportunities?crop=${encodeURIComponent(demoCrop)}&quantity=${encodeURIComponent(demoQty)}&location=${encodeURIComponent(demoLocation)}`)
  }

  const decisionJourney = [
    { step: '01', key: 'harvest', icon: '🌾', title: 'YOUR HARVEST', desc: 'Track crop specs, quantity & grade (e.g. Potato, 2,000 kg, FAQ Grade)' },
    { step: '02', key: 'market', icon: '📈', title: 'MARKET ANALYSIS', desc: 'Official Agmarknet benchmark prices (₹1,850/quintal in Hooghly Mandi)' },
    { step: '03', key: 'comparison', icon: '⚖️', title: 'MANDI COMPARISON', desc: 'Compare regional mandis by Estimated Net Return (Selling value minus Freight)' },
    { step: '04', key: 'logistics', icon: '🚚', title: 'SMART LOGISTICS', desc: 'Road distance & transport rates (45 km, ~1.2 hrs, ₹2,400 freight)' },
    { step: '05', key: 'buyers', icon: '🤝', title: 'BUYER DEMAND', desc: 'Verified regional wholesalers seeking produce with privacy protection' },
    { step: '06', key: 'opportunity', icon: '⭐', title: 'BEST OPPORTUNITY', desc: 'Explainable FarmOS Opportunity Score (91/100) recommending the best market' }
  ]

  return (
    <div className="farmos-landing-wrapper">
      
      {/* 1. HERO BANNER — Inspired by Reference Agricultural UI */}
      <section className="ag-hero-container">
        <div className="ag-hero-frame">
          {/* Background Image Layer with gradient overlay */}
          <div className="ag-hero-bg-image" style={{
            backgroundImage: `linear-gradient(180deg, rgba(11, 35, 25, 0.45) 0%, rgba(11, 35, 25, 0.75) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80')`
          }} />

          {/* Hero Inner Content Canvas */}
          <div className="ag-hero-inner">
            <motion.div
              className="ag-hero-text-block"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Overlaid Feature Badge */}
              <motion.div variants={fadeInUp} className="ag-hero-pill-badge">
                <span className="ag-pill-dot" />
                {t('home.heroBadge')}
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={fadeInUp} className="ag-hero-title">
                {t('home.heroTitleLine1')} <br />
                <span className="ag-hero-title-accent">{t('home.heroTitleLine2')}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="ag-hero-subtitle">
                {t('home.heroSubtext')} — {t('home.heroDesc')}
              </motion.p>

              {/* Action Buttons (Matching Reference Design Pill Buttons) */}
              <motion.div variants={fadeInUp} className="ag-hero-btn-group">
                <Link to="/opportunities" className="ag-hero-pill-btn-primary">
                  <span>{t('home.exploreMarketplace')}</span>
                  <div className="ag-pill-arrow-circle">➔</div>
                </Link>

                <Link to="/market-prices" className="ag-hero-pill-btn-secondary">
                  <span>{t('home.getStartedFree')}</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator at bottom center */}
            <motion.div
              className="ag-scroll-indicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="ag-scroll-text">{t('home.scrollMore')}</span>
              <div className="ag-scroll-mouse-icon">
                <div className="ag-scroll-wheel" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CORE DECISION JOURNEY SECTION */}
      <section className="ag-decision-journey-section">
        <div className="ag-container">
          <div className="ag-section-header">
            <span className="ag-section-kicker">DATA ➔ ANALYSIS ➔ OPPORTUNITY</span>
            <h2 className="ag-heading-lg">From Harvest Data to Best Market Earning</h2>
            <p className="ag-body-lg">
              FarmOS transforms raw mandi records into actionable selling decisions for farmers.
            </p>
          </div>

          <motion.div
            className="ag-journey-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {decisionJourney.map((step, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="ag-journey-card">
                <div className="ag-journey-step-num">{step.step}</div>
                <div className="ag-journey-icon">{step.icon}</div>
                <h3 className="ag-journey-title">{step.title}</h3>
                <p className="ag-journey-desc">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE OPPORTUNITY ENGINE DEMO CALCULATOR */}
      <section className="ag-demo-section">
        <div className="ag-container">
          <div className="ag-demo-card">
            <div className="ag-demo-header">
              <span className="ag-badge ag-badge-emerald">Live Opportunity Calculator</span>
              <h2 className="ag-heading-md" style={{ marginTop: '0.5rem', color: '#0f172a' }}>
                Find Your Harvest's Best Market Opportunity
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0.3rem 0 0 0' }}>
                Enter your crop & quantity to compute road distance, transport costs, and net returns.
              </p>
            </div>

            <form onSubmit={handleDemoSubmit} className="ag-demo-form">
              <div className="ag-form-group">
                <label>🌾 Select Crop</label>
                <select value={demoCrop} onChange={(e) => setDemoCrop(e.target.value)}>
                  <option value="Potato">Potato (आलू / আলু)</option>
                  <option value="Rice">Rice (चावल / ধান)</option>
                  <option value="Wheat">Wheat (गेहूं / গম)</option>
                  <option value="Onion">Onion (प्याज / পেঁয়াজ)</option>
                  <option value="Tomato">Tomato (टमाटर / টমেটো)</option>
                </select>
              </div>

              <div className="ag-form-group">
                <label>📦 Quantity (kg)</label>
                <input
                  type="number"
                  value={demoQty}
                  onChange={(e) => setDemoQty(e.target.value)}
                  placeholder="2000"
                />
              </div>

              <div className="ag-form-group">
                <label>📍 Your Location</label>
                <input
                  type="text"
                  value={demoLocation}
                  onChange={(e) => setDemoLocation(e.target.value)}
                  placeholder="e.g. Hooghly, West Bengal"
                />
              </div>

              <div className="ag-form-group ag-form-btn-wrapper">
                <button type="submit" className="ag-demo-submit-btn">
                  🔍 Calculate Opportunities →
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  )
}

export default LandingPage
