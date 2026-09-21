import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { FloatingAssistant } from '../components/FloatingAssistant'
import { MobileBottomNav } from '../components/ui/MobileBottomNav'

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#f3f7f4', overflowX: 'hidden' }}>
      {/* Left Dark Forest Sidebar */}
      <div className="hidden-mobile-sidebar">
        <Sidebar />
      </div>

      {/* Right Column: Navbar + Main Scrollable Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, width: '100%' }}>
        <Navbar />

        <main style={{ flex: 1, padding: '1.75rem 2rem', width: '100%', maxWidth: '1440px', margin: '0 auto', paddingBottom: '80px' }} className="dashboard-main-content">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Floating AI Button (Bottom Right) */}
      <FloatingAssistant />

      {/* Fixed Mobile Bottom Bar */}
      <MobileBottomNav />

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile-sidebar {
            display: none !important;
          }
          .dashboard-main-content {
            padding: 1.25rem 1rem 90px 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}
