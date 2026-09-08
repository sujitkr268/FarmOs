import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import './auth.css'

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      })

      const { token, user } = response.data

      // Save token and user in AuthContext (which syncs to localStorage)
      login(token, user)

      // Redirect user based on role
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard')
      } else if (user.role === 'buyer') {
        navigate('/buyer/dashboard')
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Login Error:', err)
      const serverMessage = err.response?.data?.message || 'Login failed. Please check your credentials.'
      setError(serverMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to access your FarmOS portal</p>

        {error && <div className="alert-message alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: error ? '1rem' : '0' }}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="e.g. farmer@test.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  )
}
