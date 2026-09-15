import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleDashboardRedirect } from './components/RoleDashboardRedirect'
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
import { ProfilePage } from './pages/user/ProfilePage'
import { SettingsPage } from './pages/user/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected App Routes using MainLayout */}
        <Route path="/traders" element={<ProtectedRoute><TraderDirectoryPage /></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><MarketPricesPage /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><MarketPricesPage /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleDashboardRedirect /></ProtectedRoute>} />
      </Route>

      {/* Role-Based Dashboard Routes using DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['farmer', 'admin']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['buyer', 'admin']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/marketplace"
          element={
            <ProtectedRoute allowedRoles={['buyer', 'farmer', 'admin']}>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
