import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

export const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* 1. HERO SECTION WITH REALISTIC AGRICULTURE LANDSCAPE BACKGROUND */}
      <section className="hero-section">
        <div className="hero-wrapper">
          {/* Hero Left Content */}
          <div className="hero-left">
            <div className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Next-Generation Agriculture Marketplace
            </div>
            
            <h1 className="hero-title">
              Empowering Farmers,<br />
              Transforming Agri-Trade
            </h1>
            
            <p className="hero-description">
              FarmOS connects farmers directly to transparent markets and verified buyers — eliminating intermediaries and maximizing harvest value.
            </p>
            
            <div className="hero-actions">
              <Link to="/buyer/marketplace" className="btn-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Explore Marketplace
              </Link>
              
              <Link to="/register" className="btn-outline-dark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
                </svg>
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Hero Right: 3 Top Floating Benefit Cards (Reference Screenshot Match) */}
          <div className="hero-floating-cards">
            {/* Card 1 */}
            <div className="floating-card">
              <span className="floating-card-num">1</span>
              <div className="floating-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>
              <div className="floating-card-title">
                verified connection to buyers
              </div>
            </div>

            {/* Card 2 */}
            <div className="floating-card">
              <span className="floating-card-num">2</span>
              <div className="floating-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                  <path d="m7 21 1.6-1.4c.4-.4.9-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8l-2.6 2.4" />
                  <circle cx="17" cy="6" r="3" />
                </svg>
              </div>
              <div className="floating-card-title">
                fair and transparent pricing
              </div>
            </div>

            {/* Card 3 */}
            <div className="floating-card">
              <span className="floating-card-num">3</span>
              <div className="floating-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div className="floating-card-title">
                seamless harvest management
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN FEATURE CARDS ROW (Reference Screenshot Match) */}
      <section className="features-section">
        <div className="features-grid">
          {/* Card 1: Verified Farmers */}
          <div className="feature-card-premium">
            <div className="feature-card-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            
            <h3>Verified Farmers</h3>
            <p>
              Verified farmers ensures outputs are authentic, achievable, and directly connected to verified commercial buyers.
            </p>

            <div className="card-divider"></div>
          </div>

          {/* Card 2: Real-time Market Data */}
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 17 2 2 4-4" />
                <path d="M18 10a6 6 0 0 0-12 0c0 4.97 6 11 6 11s6-6.03 6-11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            
            <h3>Real-time Market Data</h3>
            <p>
              Real-time market data & analytics by regional supply/demand metrics to drive intelligent pricing and market growth.
            </p>

            <div className="card-divider"></div>
          </div>

          {/* Card 3: Simplified Logistics */}
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            
            <h3>Simplified Logistics</h3>
            <p>
              Easily harvest complete output to market, connecting farm dispatch with simplified status tracking and transport metrics.
            </p>

            <div className="card-divider"></div>
          </div>

          {/* Card 4: Direct to Market */}
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            
            <h3>Direct to Market</h3>
            <p>
              Direct to Market access across regional hubs, ensuring seamless trading directly from origin to buyer.
            </p>

            <div className="card-divider"></div>
          </div>
        </div>
      </section>

      {/* 3. HOW FARMOS WORKS WORKFLOW */}
      <section className="section" id="how-it-works">
        <h2 className="section-title">How FarmOS Works</h2>
        <p className="section-subtitle">
          Connecting Every Harvest to Its Best Opportunity in 4 Simple Steps.
        </p>

        <div className="steps-container">
          <div className="step-card-premium">
            <div className="step-num-badge">01</div>
            <h4>Farmer Posts Harvest</h4>
            <p>Farmers list crop details, quantity, unit, price, and location on the platform.</p>
          </div>

          <div className="step-card-premium">
            <div className="step-num-badge">02</div>
            <h4>Buyers Discover Produce</h4>
            <p>Commercial buyers explore verified listings with live filters by crop and region.</p>
          </div>

          <div className="step-card-premium">
            <div className="step-num-badge">03</div>
            <h4>Order Confirmation</h4>
            <p>Buyers submit purchase orders with required quantity and locked pricing.</p>
          </div>

          <div className="step-card-premium">
            <div className="step-num-badge">04</div>
            <h4>Fulfillment & Dispatch</h4>
            <p>Farmers confirm incoming orders, update stock status, and fulfill transport.</p>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM PORTALS SECTION */}
      <section className="section" id="roles">
        <h2 className="section-title">Engineered For Agriculture Stakeholders</h2>
        <p className="section-subtitle">
          Dedicated, role-aware interfaces tailored for farmers, commercial buyers, and administrators.
        </p>

        <div className="roles-grid">
          <div className="role-card-premium">
            <div className="role-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11Z" />
              </svg>
            </div>
            <h3>Farmer Portal</h3>
            <p>
              Post your crop listings, track available inventory, manage incoming buyer orders, and maximize harvest profit.
            </p>
            <Link to="/farmer/dashboard" className="btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
              Farmer Dashboard ➔
            </Link>
          </div>

          <div className="role-card-premium">
            <div className="role-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3>Buyer Portal</h3>
            <p>
              Explore fresh harvests, filter by crop or price, view farmer contacts, and place direct purchase orders.
            </p>
            <Link to="/buyer/dashboard" className="btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
              Buyer Dashboard ➔
            </Link>
          </div>

          <div className="role-card-premium">
            <div className="role-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Admin Portal</h3>
            <p>
              Monitor overall platform health, oversee system metrics, manage user roles, and audit trade pipelines.
            </p>
            <Link to="/admin/dashboard" className="btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
              Admin Dashboard ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section style={{ padding: '0 1.5rem' }}>
        <div className="cta-box">
          <h2 className="cta-title">Connecting Every Harvest to Its Best Opportunity</h2>
          <p className="cta-description">
            Join the digital agricultural revolution today. Register as a farmer or buyer and start trading with confidence.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn-gold">
              Get Started Free ➔
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
