import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { MarketPricesPage } from './pages/public/MarketPricesPage'
import { WeatherPage } from './pages/public/WeatherPage'
import { AssistantPage } from './pages/public/AssistantPage'
import { TraderDirectoryPage } from './pages/public/TraderDirectoryPage'
import { FarmerDashboard } from './pages/farmer/FarmerDashboard'
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { Marketplace } from './pages/buyer/Marketplace'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/traders" element={<TraderDirectoryPage />} />
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Role-Based Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/marketplace" element={<Marketplace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
