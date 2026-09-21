import React from 'react'

export const LoadingState = ({ message = 'Loading data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      color: '#9ca3af',
      textAlign: 'center'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid rgba(16, 185, 129, 0.2)',
        borderTopColor: '#10b981',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '1rem'
      }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f3f4f6' }}>{message}</span>
    </div>
  )
}

export default LoadingState
