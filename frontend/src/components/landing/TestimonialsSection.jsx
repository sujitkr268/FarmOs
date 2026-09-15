import React from 'react'

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "FarmOS helped me realize Birbhum APMC was offering ₹300/quintal more than local aggregators. Even after paying ₹1,800 freight, I made ₹6,200 extra profit on my potato stock!",
      author: "Subhash Roy",
      role: "Potato Farmer",
      location: "Hooghly, West Bengal",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      quote: "As a verified rice miller, finding trustworthy paddy supplies used to take weeks. With FarmOS directory and verified badges, we connect with genuine farmers instantly.",
      author: "Anjan Sen",
      role: "Rice Miller & Wholesaler",
      location: "Purba Bardhaman, West Bengal",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      quote: "The freight calculator and Gemini AI assistant give me accurate transport estimates in seconds. I never sell below benchmark mandi rates anymore.",
      author: "Biplab Mahato",
      role: "Vegetable Grower",
      location: "Purulia, West Bengal",
      rating: "⭐⭐⭐⭐⭐"
    }
  ]

  return (
    <section style={{
      backgroundColor: '#f7faf8',
      padding: '6rem 1.5rem',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
            Farmer Success Stories
          </span>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Trusted Across Agricultural Communities
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            Hear from real farmers, aggregators, and millers benefiting from FarmOS market intelligence.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>{t.rating}</div>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#022c22' }}>{t.author}</strong>
                <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>{t.role}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>📍 {t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
