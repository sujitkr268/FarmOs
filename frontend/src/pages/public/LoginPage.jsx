import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './auth.css'

export const LoginPage = () => {
  const { t } = useLanguage()
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
        <h2 className="auth-title">{t('auth.signIn')}</h2>
        <p className="auth-subtitle">{t('auth.signInSub')}</p>

        {error && <div className="alert-message alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: error ? '1rem' : '0' }}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.emailAddr')}</label>
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
            <label htmlFor="password">{t('auth.password')}</label>
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
            {loading ? t('common.loading') : t('nav.login')}
          </button>
        </form>

        <p className="auth-footer-text">
          {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  )
}
