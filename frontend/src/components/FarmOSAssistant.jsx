import React, { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api/chatApi'
import { MarketComparison } from './MarketComparison'

// Helper function to render simple markdown formatting (bold, headers, tables, bullet lists)
const renderFormattedText = (text) => {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []

  let inTable = false
  let tableRows = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Table Row Detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      // Skip markdown divider line (| :--- | :--- |)
      if (!trimmed.includes('---')) {
        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
        tableRows.push(cells)
      }
      return
    }

    // If table ended, render table accumulated so far
    if (inTable && (!trimmed.startsWith('|') || index === lines.length - 1)) {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0]
        const bodyRows = tableRows.slice(1)
        elements.push(
          <div key={`table-${index}`} style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', borderBottom: '1px solid var(--border-gold)' }}>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: 'var(--accent-gold-light)' }}>
                      {cell.replace(/\*\*/g, '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '0.55rem 0.8rem', color: 'var(--text-primary)' }}>
                        {cell.replace(/\*\*/g, '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
      }
      inTable = false
    }

    if (!trimmed) {
      elements.push(<div key={`space-${index}`} style={{ height: '0.4rem' }} />)
      return
    }

    // Headers (### Header)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginTop: '0.8rem', marginBottom: '0.4rem' }}>
          {trimmed.replace('### ', '').replace(/\*\*/g, '')}
        </h4>
      )
      return
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          {trimmed.replace('## ', '').replace(/\*\*/g, '')}
        </h3>
      )
      return
    }

    // Bullet List Items (* Item or - Item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.substring(2)
      elements.push(
        <li key={index} style={{ marginLeft: '1.25rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
          {formatInlineBold(content)}
        </li>
      )
      return
    }

    // Standard Paragraph Line
    elements.push(
      <p key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
        {formatInlineBold(trimmed)}
      </p>
    )
  })

  return elements
}

// Helper to format **bold** text inline
const formatInlineBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--accent-gold-light)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export const FarmOSAssistant = ({ isCompact = false }) => {
  // Chat History State
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi! I'm the FarmOS Assistant. I can help with market prices, weather, farming questions, and your FarmOS marketplace.",
      context: null
    }
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  // Example Prompt Chips
  const exampleQuestions = [
    'Where should I sell 500 kg potato?',
    'What is the potato price in West Bengal?',
    'What is the weather in Kolkata today?'
  ]

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputMessage).trim()
    if (!queryText || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMessage('')
    setLoading(true)

    try {
      const response = await sendChatMessage(queryText)

      if (response && response.success) {
        const assistantMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: response.message,
          context: response.context || null
        }
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: '⚠️ Sorry, I encountered an issue generating a response. Please try again.',
            isError: true
          }
        ])
      }
    } catch (err) {
      console.error('Chat Assistant Error:', err)
      const errorText = err.response?.data?.message || err.message || 'Unable to connect to FarmOS Assistant backend server.'
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `⚠️ Connection Error: ${errorText}`,
          isError: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-card)',
      border: isCompact ? 'none' : '1px solid var(--border-gold)',
      borderRadius: isCompact ? '0' : '24px',
      display: 'flex',
      flexDirection: 'column',
      height: isCompact ? '100%' : '720px',
      maxHeight: isCompact ? '100%' : 'calc(100vh - 100px)',
      boxShadow: isCompact ? 'none' : '0 12px 40px rgba(0, 0, 0, 0.45)',
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    }}>
      {/* Chat Window Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(16, 19, 26, 0.95) 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: isCompact ? '0.75rem 1rem' : '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px var(--accent-gold-glow)'
          }}>
            🤖
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              FarmOS Assistant
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              AI Agri-Advisor • Live Mandi Rates & Weather Data Integrated
            </span>
          </div>
        </div>

        <span style={{
          backgroundColor: 'rgba(46, 160, 67, 0.15)',
          border: '1px solid rgba(46, 160, 67, 0.3)',
          color: '#4ade80',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
          Online
        </span>
      </div>

      {/* Example Question Chips Bar */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          💡 Try asking:
        </span>
        {exampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-gold-light)',
              fontSize: '0.8rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Messages Display Body */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Context Badge indicator for assistant response */}
            {msg.sender === 'assistant' && msg.context?.type && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: msg.context.type === 'opportunity'
                  ? 'var(--accent-gold)'
                  : msg.context.type === 'market'
                    ? 'var(--accent-gold-light)'
                    : '#60a5fa',
                backgroundColor: msg.context.type === 'opportunity'
                  ? 'rgba(212, 175, 55, 0.2)'
                  : msg.context.type === 'market'
                    ? 'rgba(212, 175, 55, 0.15)'
                    : 'rgba(96, 165, 250, 0.15)',
                border: '1px solid ' + (
                  msg.context.type === 'opportunity' || msg.context.type === 'market'
                    ? 'var(--border-gold)'
                    : 'rgba(96, 165, 250, 0.3)'
                ),
                padding: '0.15rem 0.55rem',
                borderRadius: '12px',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {msg.context.type === 'opportunity'
                  ? '🏆 FarmOS Opportunity Engine Evaluated'
                  : msg.context.type === 'market'
                    ? '📊 Real-Time Mandi Data Injected'
                    : '🌤️ Live Open-Meteo Weather Injected'}
              </span>
            )}

            {/* Bubble Box */}
            <div style={{
              backgroundColor: msg.sender === 'user'
                ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))'
                : msg.isError
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, #d4af37, #b89327)'
                : undefined,
              border: msg.sender === 'user'
                ? 'none'
                : msg.isError
                  ? '1px solid rgba(239, 68, 68, 0.3)'
                  : '1px solid var(--border-color)',
              color: msg.sender === 'user' ? '#080a0e' : 'var(--text-primary)',
              padding: '1rem 1.25rem',
              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              fontSize: '0.92rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: msg.sender === 'assistant' && msg.context?.type === 'opportunity' ? '100%' : undefined
            }}>
              {msg.sender === 'user' ? (
                <span style={{ fontWeight: 600 }}>{msg.text}</span>
              ) : (
                <>
                  {renderFormattedText(msg.text)}
                  {msg.context?.type === 'opportunity' && msg.context?.data && (
                    <MarketComparison data={msg.context.data} />
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px 20px 20px 4px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-secondary)',
            fontSize: '0.88rem'
          }}>
            <span style={{ fontSize: '1.2rem', animation: 'spin 1s infinite linear' }}>⏳</span>
            <span>FarmOS Assistant is analyzing & fetching real-time data...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Text Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}
      >
        <input
          type="text"
          placeholder="Ask about market prices, weather, or crop management advice..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.85rem 1.1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
            color: '#080a0e',
            fontWeight: 700,
            fontSize: '0.92rem',
            opacity: loading || !inputMessage.trim() ? 0.6 : 1,
            boxShadow: '0 4px 14px var(--accent-gold-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <span>Send</span>
          <span>➔</span>
        </button>
      </form>
    </div>
  )
}
