import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { FloatingAssistant } from '../components/FloatingAssistant'

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '200px', padding: '1.5rem', background: '#181818', borderRight: '1px solid #333' }}>
          <h4>Dashboard Menu</h4>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>Role-based navigation menu placeholder</p>
        </aside>
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <FloatingAssistant />
    </div>
  )
}
