import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { FloatingAssistant } from '../components/FloatingAssistant'

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <div className="dashboard-container-row" style={{ display: 'flex', flex: 1, width: '100%' }}>
        <aside className="dashboard-sidebar" style={{
          width: '220px',
          padding: '1.5rem',
          backgroundColor: '#10131a',
          borderRight: '1px solid var(--border-color)',
          flexShrink: 0
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Dashboard Menu
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Role-based navigation and fast harvest tools.
          </p>
        </aside>

        <main className="dashboard-main-content" style={{ flex: 1, padding: '1.5rem 1rem', width: '100%', maxWidth: '100%' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <FloatingAssistant />

      <style>{`
        @media (max-width: 768px) {
          .dashboard-container-row {
            flex-direction: column !important;
          }
          .dashboard-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color) !important;
            padding: 1rem 1.25rem !important;
          }
          .dashboard-main-content {
            padding: 1rem 0.6rem !important;
          }
        }
      `}</style>
    </div>
  )
}
