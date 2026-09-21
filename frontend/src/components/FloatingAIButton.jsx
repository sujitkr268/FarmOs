import React from 'react'
import { useNavigate } from 'react-router-dom'

export const FloatingAIButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/assistant')}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#06120c',
        fontWeight: 800,
        fontSize: '0.9rem',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 0 16px rgba(16, 185, 129, 0.2)',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, boxShadow 0.2s ease'
      }}
      title="Ask FarmOS AI Assistant"
      aria-label="Ask FarmOS AI Assistant"
    >
      <span style={{ fontSize: '1.2rem' }}>🤖</span>
      <span>Ask FarmOS AI</span>
    </button>
  )
}

export default FloatingAIButton
