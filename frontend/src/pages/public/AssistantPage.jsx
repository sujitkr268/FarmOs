import React from 'react'
import { FarmOSAssistant } from '../../components/FarmOSAssistant'

export const AssistantPage = () => {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.5rem 1rem',
      color: 'var(--text-primary)'
    }} className="assistant-page-container">
      <FarmOSAssistant />

      <style>{`
        @media (max-width: 480px) {
          .assistant-page-container {
            padding: 0.75rem 0.4rem !important;
          }
        }
      `}</style>
    </div>
  )
}
