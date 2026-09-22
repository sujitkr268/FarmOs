import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { FloatingAssistant } from '../components/FloatingAssistant'

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '1.5rem 1rem', width: '100%', maxWidth: '100%' }} className="main-content-area">
        <Outlet />
      </main>
      <Footer />
      <FloatingAssistant />

      <style>{`
        @media (max-width: 480px) {
          .main-content-area {
            padding: 1rem 0.6rem !important;
          }
        }
      `}</style>
    </div>
  )
}
