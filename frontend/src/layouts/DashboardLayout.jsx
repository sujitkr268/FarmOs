import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { FloatingAIButton } from '../components/FloatingAIButton'

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#06120c', overflowX: 'hidden' }}>
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Right Workspace Column */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, width: '100%' }}>
        {/* Top Header */}
        <Navbar />

        {/* Scrollable Main Workspace Content */}
        <main style={{ flex: 1, padding: 'clamp(1rem, 2.5vw, 1.75rem)', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
          <Outlet />
        </main>

        <Footer />
      </div>

      <FloatingAIButton />
    </div>
  )
}

export default DashboardLayout
