import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import './auth.css'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'farmer' // Default role
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Prevent public user from selecting admin
    if (formData.role !== 'farmer' && formData.role !== 'buyer') {
      setError('Registration is only allowed for Farmer or Buyer accounts.')
      setLoading(false)
      return
    }

    try {
      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        role: formData.role
      })

      setSuccess('Account created successfully! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (err) {
      console.error('Registration API Call Failed:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      })

      const statusCode = err.response?.status ? `[HTTP ${err.response.status}] ` : '[Network Error] '
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message
      const details = err.response?.data ? ` Details: ${JSON.stringify(err.response.data)}` : ''

      setError(`${statusCode}${serverMsg}${details}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <h2 className="auth-title">Join FarmOS</h2>
        <p className="auth-subtitle">Create an account to manage or purchase produce</p>

        {error && <div className="alert-message alert-error">{error}</div>}
        {success && <div className="alert-message alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: (error || success) ? '1rem' : '0' }}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="e.g. ramesh@farmos.com"
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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location / District</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              placeholder="e.g. Bardhaman, West Bengal"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="farmer">Farmer (Produce Seller)</option>
              <option value="buyer">Buyer (Commercial Produce Buyer)</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
