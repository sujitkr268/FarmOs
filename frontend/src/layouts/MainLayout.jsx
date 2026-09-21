import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { FloatingAIButton } from '../components/FloatingAIButton'

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#06120c' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 'clamp(1rem, 2vw, 1.5rem) 1rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        <Outlet />
      </main>
      <Footer />
      <FloatingAIButton />
    </div>
  )
}

export default MainLayout
