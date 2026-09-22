import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './LandingPage.css'

export const LandingPage = () => {
  const { t } = useLanguage()

  const features = [
    {
      title: 'Market Intelligence',
      description: 'Real-time APMC mandi prices and historical price trends across all major regional hubs.',
      icon: '📈'
    },
    {
      title: 'Smart Logistics',
      description: 'Calculates exact freight transport costs and net return margins before you ship.',
      icon: '🚚'
    },
    {
      title: 'Potential Buyers',
      description: 'Direct connections with verified wholesalers, traders, and institutional buyers.',
      icon: '🤝'
    },
    {
      title: 'Weather Intelligence',
      description: '7-day localized agricultural weather forecasts to plan harvest and transport timing.',
      icon: '🌤️'
    },
    {
      title: 'AI Assistant',
      description: 'Powered by Gemini AI to give instant agronomy advice, price guidance, and selling insights.',
      icon: '💬'
    },
    {
      title: 'Trusted Marketplace',
      description: 'Government verification badges (PM-KISAN, e-NAM, Udyam) for safe transparent deals.',
      icon: '🛡️'
    }
  ]

  const workflowSteps = [
    { step: '1', title: 'Harvest', desc: 'Register crop stock' },
    { step: '2', title: 'Market Prices', desc: 'Check live mandi rates' },
    { step: '3', title: 'Opportunity Analysis', desc: 'Calculate net profit' },
    { step: '4', title: 'Logistics', desc: 'Estimate freight costs' },
    { step: '5', title: 'Potential Buyers', desc: 'Connect with verified buyers' },
    { step: '6', title: 'Better Decision', desc: 'Maximize your harvest income' }
  ]

  return (
    <div style={{ backgroundColor: '#f3f7f4', minHeight: '100vh', color: '#0f172a' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0b2319 0%, #103828 50%, #071912 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem 6rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.35rem 0.95rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            🌱 Premium Agricultural Technology Platform
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Connecting Every Harvest to Its Best Opportunity
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '750px', margin: '0 auto 2.25rem' }}>
            FarmOS helps farmers compare markets, calculate transport costs, discover potential buyers and make better selling decisions.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              Get Started
            </Link>

            <Link
              to="/marketplace"
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              Explore FarmOS
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW FARMOS WORKS FLOW */}
      <section style={{ maxWidth: '1200px', margin: '-2.5rem auto 4rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2rem 1.5rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            How FarmOS Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            {workflowSteps.map((w, idx) => (
              <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1rem 0.75rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto', fontSize: '0.85rem' }}>
                  {w.step}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{w.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Comprehensive Agriculture Intelligence
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to trade produce, track mandi rates, calculate logistics, and maximize net profits.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s, border-color 0.2s'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
