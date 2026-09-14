import React from 'react'
import { FarmOSAssistant } from '../../components/FarmOSAssistant'

export const AssistantPage = () => {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)'
    }}>
      <FarmOSAssistant />
    </div>
  )
}
