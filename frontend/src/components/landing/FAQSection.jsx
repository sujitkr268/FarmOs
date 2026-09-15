import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const FAQSection = () => {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: t('landing.faq1Q', 'How does FarmOS calculate the Best Opportunity and Net Returns?'),
      a: t('landing.faq1A', 'FarmOS fetches live Agmarknet mandi rates for your crop in nearby regional hubs, computes exact road distance via OpenRouteService, deducts estimated freight costs based on payload size, and ranks markets by net profit in your hand.')
    },
    {
      q: t('landing.faq2Q', 'Is FarmOS free for farmers to use?'),
      a: t('landing.faq2A', 'Yes, searching mandi prices, viewing weather forecasts, computing freight costs, and asking FarmOS AI is 100% free for registered farmers.')
    },
    {
      q: t('landing.faq3Q', 'How are Buyers and Traders verified on FarmOS?'),
      a: t('landing.faq3A', 'FarmOS matches accounts against official government evidence (APEDA AgriExchange, WBSAMB APMC licenses, Udyam MSME certificates, and company portals) to grant Verified Business badges.')
    },
    {
      q: t('landing.faq4Q', 'Is my phone number kept private from public search?'),
      a: t('landing.faq4A', 'Yes! FarmOS strictly enforces contact privacy rules. Your phone number and email are never shown publicly unless you explicitly enable the "Show Contact Publicly" setting.')
    },
    {
      q: t('landing.faq5Q', 'Does FarmOS support Hindi and regional language display?'),
      a: t('landing.faq5A', 'Yes, FarmOS offers full English and Hindi (हिंदी) language toggling across the entire application shell, navigation, and AI assistant.')
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="about" style={{
      backgroundColor: '#ffffff',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
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
            {t('landing.faqBadge', 'Got Questions?')}
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.faqTitle', 'Frequently Asked Questions')}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.faqSub', 'Everything you need to know about FarmOS market comparisons and trust verification.')}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((f, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} style={{
                backgroundColor: isOpen ? '#f0fdf4' : '#f8fafc',
                border: '1px solid ' + (isOpen ? '#10b981' : '#e2e8f0'),
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}>
                <button
                  onClick={() => toggleFAQ(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#022c22'
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: '#10b981', fontSize: '1.3rem', marginLeft: '1rem' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    fontSize: '0.92rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    {f.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
