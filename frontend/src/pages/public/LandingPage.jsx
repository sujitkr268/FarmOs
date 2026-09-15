import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './LandingPage.css'

export const LandingPage = () => {
  const { t } = useLanguage()

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
              {t('home.heroBadge')}
            </div>
            
            <h1 className="hero-title">
              {t('home.heroTitleLine1')}<br />
              {t('home.heroTitleLine2')}
            </h1>
            
            <p className="hero-description">
              {t('home.heroDesc')}
            </p>
            
            <div className="hero-actions">
              <Link to="/buyer/marketplace" className="btn-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {t('home.exploreMarketplace')}
              </Link>
              
              <Link to="/register" className="btn-outline-dark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
                </svg>
                {t('home.getStartedFree')}
              </Link>
            </div>
          </div>

          {/* Hero Right: 3 Top Floating Benefit Cards */}
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
                {t('home.card1Title')}
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
                {t('home.card2Title')}
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
                {t('home.card3Title')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN FEATURE CARDS ROW */}
      <section className="features-section">
        <div className="features-grid">
          {/* Card 1 */}
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
            
            <h3>{t('home.feature1Title')}</h3>
            <p>{t('home.feature1Desc')}</p>

            <div className="card-divider"></div>
          </div>

          {/* Card 2 */}
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 17 2 2 4-4" />
                <path d="M18 10a6 6 0 0 0-12 0c0 4.97 6 11 6 11s6-6.03 6-11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            
            <h3>{t('home.feature2Title')}</h3>
            <p>{t('home.feature2Desc')}</p>

            <div className="card-divider"></div>
          </div>

          {/* Card 3 */}
          <div className="feature-card-premium">
            <div className="feature-icon-wrapper">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            
            <h3>{t('home.feature3Title')}</h3>
            <p>{t('home.feature3Desc')}</p>

            <div className="card-divider"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
