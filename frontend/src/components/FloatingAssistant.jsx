import React, { useState } from 'react'
import { FarmOSAssistant } from './FarmOSAssistant'

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="floating-assistant-wrapper" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {/* Floating Action Button (Launcher) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
            color: '#080a0e',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5), 0 0 20px var(--accent-gold-glow)',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
            position: 'relative'
          }}
          title="Open FarmOS Assistant"
          aria-label="Open FarmOS AI Assistant"
        >
          🤖
          {/* Online Green Pulse Indicator */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            border: '2px solid #080a0e'
          }} />
        </button>
      )}

      {/* Floating Compact Chat Panel */}
      {isOpen && (
        <div className="floating-assistant-panel" style={{
          width: '450px',
          maxWidth: 'calc(100vw - 24px)',
          height: '620px',
          maxHeight: 'calc(100vh - 40px)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '20px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Panel Header bar with Close Button */}
          <div style={{
            backgroundColor: 'rgba(16, 19, 26, 0.98)',
            padding: '0.6rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🤖 FarmOS Floating AI Assistant
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px'
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
        @media (max-width: 500px) {
          .floating-assistant-wrapper {
            bottom: 12px !important;
            right: 12px !important;
          }
          .floating-assistant-panel {
            width: calc(100vw - 24px) !important;
            height: calc(100vh - 32px) !important;
            max-height: calc(100vh - 32px) !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
