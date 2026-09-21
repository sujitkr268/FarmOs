import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './LandingPage.css'

export const LandingPage = () => {
  const { t } = useLanguage()

  return (
    <div className="landing-container">
      {/* 1. AGRICULTURAL HERO SECTION */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-left">
            <div className="hero-badge">
              <span>🌾</span>
              <span>Next-Generation Agriculture Technology Platform</span>
            </div>

            <h1 className="hero-title">
              Connecting Every Harvest to Its <span className="hero-gradient-text">Best Opportunity</span>
            </h1>

            <p className="hero-description">
              FarmOS helps farmers compare markets, calculate transport costs, discover potential buyers and make better selling decisions.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn-primary-emerald">
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>

              <Link to="/marketplace" className="btn-secondary-outline">
                Explore FarmOS
              </Link>
            </div>
          </div>

          {/* Hero Floating Decision Highlight Card */}
          <div className="hero-right-card">
            <div className="floating-opportunity-box">
              <div className="box-header">
                <span className="badge-emerald">Live Mandi Opportunity</span>
                <span className="time-tag">Updated Just Now</span>
              </div>
              <h3 className="box-title">🌾 Basmati Rice Harvest</h3>
              <div className="box-stats">
                <div>
                  <span className="label">Recommended Mandi</span>
                  <span className="val">Kolkata Central Mandi</span>
                </div>
                <div>
                  <span className="label">Gross Market Price</span>
                  <span className="val emerald">₹2,850 / qtl</span>
                </div>
                <div>
                  <span className="label">Distance & Freight</span>
                  <span className="val amber">38 km (₹750)</span>
                </div>
                <div>
                  <span className="label">Calculated Net Return</span>
                  <span className="val highlight">₹13,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW FARMOS WORKS (STEP-BY-STEP FLOW DIAGRAM) */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-badge">How FarmOS Works</span>
          <h2>Empowering Smart Agri-Trade Decisions</h2>
          <p>From field harvest to final settlement in 6 seamless intelligent steps.</p>
        </div>

        <div className="flow-steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h4>Harvest</h4>
            <p>Post your crop listing with quantity, unit, and location.</p>
          </div>
          <div className="flow-arrow">→</div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h4>Market Prices</h4>
            <p>Fetch real-time Agmarknet benchmark mandi prices.</p>
          </div>
          <div className="flow-arrow">→</div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h4>Opportunity Analysis</h4>
            <p>Compare gross revenues across regional APMC mandis.</p>
          </div>
          <div className="flow-arrow">→</div>

          <div className="step-card">
            <div className="step-num">4</div>
            <h4>Logistics</h4>
            <p>Calculate road freight and travel costs accurately.</p>
          </div>
          <div className="flow-arrow">→</div>

          <div className="step-card">
            <div className="step-num">5</div>
            <h4>Potential Buyers</h4>
            <p>Connect directly with verified regional buyers.</p>
          </div>
          <div className="flow-arrow">→</div>

          <div className="step-card highlight-step">
            <div className="step-num green">6</div>
            <h4>Better Selling Decision</h4>
            <p>Maximize your net harvest profits with full transparency.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">Platform Intelligence</span>
          <h2>Everything You Need for Agri-Trade</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Market Intelligence</h3>
            <p>Access official daily Agmarknet benchmark prices (min, max, modal) for hundreds of commodities across Indian states.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚛</div>
            <h3>Smart Logistics</h3>
            <p>Calculate realistic road transport freight costs and travel times to find the true net profit after transport.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Potential Buyers</h3>
            <p>Connect with legitimate, verified agricultural buyers, rice millers, and wholesalers without unnecessary middlemen.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h3>Weather Intelligence</h3>
            <p>Real-time agricultural weather forecasts and farming advisories powered by Open-Meteo API.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get instant intelligent advice on crop pricing, selling strategies, and logistics using Google Gemini AI.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Trusted Marketplace</h3>
            <p>Transparent produce listings with trust verification badges, e-NAM/Udyam references, and privacy controls.</p>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to Maximize Your Harvest Value?</h2>
          <p>Join thousands of farmers and verified buyers transforming agricultural commerce.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary-emerald">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary-outline">
              Sign In to FarmOS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
