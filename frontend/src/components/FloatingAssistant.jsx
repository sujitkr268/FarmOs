import React, { useState } from 'react'
import { FarmOSAssistant } from './FarmOSAssistant'
import { useAuth } from '../context/AuthContext'

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className={`floating-assistant-wrapper${isAuthenticated ? ' has-bottom-nav' : ''}`} style={{
      position: 'fixed',
      bottom: '20px',
      right: '16px',
      zIndex: 997
    }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            height: '46px',
            padding: '0 1rem',
            borderRadius: '30px',
            backgroundColor: '#0b2319',
            border: '2px solid #10b981',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease'
          }}
          title="Open FarmOS AI Assistant"
          aria-label="Ask FarmOS AI"
          className="floating-ai-btn"
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            color: '#0b2319',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            flexShrink: 0
          }}>
            🍃
          </div>
          <span className="floating-btn-text">Ask FarmOS AI</span>
        </button>
      )}

      {/* Floating Compact Chat Panel */}
      {isOpen && (
        <div className="floating-assistant-panel" style={{
          width: '420px',
          maxWidth: 'calc(100vw - 24px)',
          height: '580px',
          maxHeight: 'calc(100vh - 40px)',
          backgroundColor: '#ffffff',
          border: '1px solid #10b981',
          borderRadius: '20px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Panel Header bar with Close Button */}
          <div style={{
            backgroundColor: '#0b2319',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🍃 FarmOS AI Assistant
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem'
              }}
              title="Close Assistant"
              aria-label="Close Assistant"
            >
              ✕
            </button>
          </div>

          {/* Embedded Assistant */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <FarmOSAssistant isCompact={true} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .floating-assistant-wrapper.has-bottom-nav {
            bottom: 78px !important;
          }
        }
        @media (max-width: 480px) {
          .floating-assistant-wrapper {
            bottom: 16px !important;
            right: 12px !important;
          }
          .floating-assistant-wrapper.has-bottom-nav {
            bottom: 78px !important;
          }
          .floating-btn-text {
            display: none !important;
          }
          .floating-ai-btn {
            width: 44px !important;
            height: 44px !important;
            padding: 0 !important;
            justify-content: center !important;
            border-radius: 50% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingAssistant
