import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { FloatingAssistant } from '../components/FloatingAssistant'

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#080e0a', overflowX: 'hidden' }}>
      {/* Left Sidebar (Desktop) */}
      <div className="hidden-mobile-sidebar">
        <Sidebar />
      </div>

      {/* Main Container Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, width: '100%' }}>
        {/* Top Header */}
        <Navbar />

        {/* Scrollable Main Workspace Content */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }} className="dashboard-main-content">
          <Outlet />
        </main>

        <Footer />
      </div>

      <FloatingAssistant />

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile-sidebar {
            display: none !important;
          }
          .dashboard-main-content {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}
