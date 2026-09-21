import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingFooter } from '../components/landing/LandingFooter'
import { FloatingAssistant } from '../components/FloatingAssistant'
import { MobileBottomNav } from '../components/ui/MobileBottomNav'

export const MainLayout = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {isLandingPage ? <LandingNavbar /> : <Navbar />}

      <main style={{
        flex: 1,
        padding: isLandingPage ? 0 : '1.5rem 1rem 5rem 1rem',
        width: '100%',
        maxWidth: '100%'
      }} className={isLandingPage ? '' : 'main-content-area'}>
        <Outlet />
      </main>

      {isLandingPage ? <LandingFooter /> : <Footer />}
      <FloatingAssistant />
      <MobileBottomNav />

      <style>{`
        @media (max-width: 640px) {
          .main-content-area {
            padding: 1rem 0.75rem 5.5rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MainLayout
