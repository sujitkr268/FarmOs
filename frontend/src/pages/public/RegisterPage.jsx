import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useLanguage } from '../../context/LanguageContext'
import './auth.css'

export const RegisterPage = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'farmer',
    
    // Optional buyer fields
    business_name: '',
    state: 'West Bengal',
    district: '',
    mandi: '',
    commodities: '',
    buying_capacity: '',
    enam_reference: '',
    udyam_reference: '',
    official_website: '',
    show_contact_publicly: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.role !== 'farmer' && formData.role !== 'buyer') {
      setError('Registration is only allowed for Farmer or Buyer accounts.')
      setLoading(false)
      return
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        role: formData.role
      }

      if (formData.role === 'buyer') {
        payload.business_name = formData.business_name || formData.name + ' Traders'
        payload.state = formData.state || 'West Bengal'
        payload.district = formData.district || formData.location
        payload.mandi = formData.mandi
        payload.commodities = formData.commodities
        payload.buying_capacity = formData.buying_capacity
        payload.enam_reference = formData.enam_reference
        payload.udyam_reference = formData.udyam_reference
        payload.official_website = formData.official_website
        payload.show_contact_publicly = formData.show_contact_publicly
      }

      const response = await API.post('/auth/register', payload)

      const successMsg = formData.role === 'buyer'
        ? 'Buyer account registered! Submitted for admin verification. Redirecting to login...'
        : 'Account created successfully! Redirecting to login...'

      setSuccess(successMsg)

      setTimeout(() => {
        navigate('/login')
      }, 1800)

    } catch (err) {
      console.error('Registration API Call Failed:', err)
      const serverMsg = err.response?.data?.message || err.message
      setError(serverMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: formData.role === 'buyer' ? '600px' : '480px', transition: 'all 0.3s' }}>
        <h2 className="auth-title">{t('auth.join')}</h2>
        <p className="auth-subtitle">{t('auth.joinSub')}</p>

        {error && <div className="alert-message alert-error">{error}</div>}
        {success && <div className="alert-message alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: (error || success) ? '1rem' : '0' }}>
          <div className="form-group">
            <label htmlFor="role">{t('auth.accountType')} *</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="farmer">{t('auth.roleFarmer')}</option>
              <option value="buyer">{t('auth.roleBuyer')}</option>
            </select>
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label htmlFor="name">{t('auth.fullName')} *</label>
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
              <label htmlFor="email">{t('auth.emailAddr')} *</label>
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
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label htmlFor="password">{t('auth.password')} *</label>
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
              <label htmlFor="phone">{t('auth.phoneNum')} *</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="location">{t('auth.locationDist')} *</label>
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

          {/* Buyer Specific Fields */}
          {formData.role === 'buyer' && (
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <h4 style={{ color: '#60a5fa', margin: '0 0 0.85rem 0', fontSize: '0.92rem' }}>
                {t('auth.buyerBusinessProfile')}
              </h4>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="business_name">{t('auth.businessName')}</label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  className="form-control"
                  placeholder="e.g. Bengal Grain Processors Ltd."
                  value={formData.business_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label htmlFor="commodities">{t('directory.commoditiesPurchased')}</label>
                  <input
                    type="text"
                    id="commodities"
                    name="commodities"
                    className="form-control"
                    placeholder="e.g. Potato, Rice, Wheat"
                    value={formData.commodities}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="buying_capacity">{t('directory.buyingCapacity')}</label>
                  <input
                    type="text"
                    id="buying_capacity"
                    name="buying_capacity"
                    className="form-control"
                    placeholder="e.g. 500 MT/month"
                    value={formData.buying_capacity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div className="form-group">
                  <label htmlFor="enam_reference">{t('auth.optEnamRef')}</label>
                  <input
                    type="text"
                    id="enam_reference"
                    name="enam_reference"
                    className="form-control"
                    placeholder="e.g. ENAM/WB/TR/9041"
                    value={formData.enam_reference}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="udyam_reference">{t('auth.optUdyamRef')}</label>
                  <input
                    type="text"
                    id="udyam_reference"
                    name="udyam_reference"
                    className="form-control"
                    placeholder="e.g. UDYAM-WB-03-0012345"
                    value={formData.udyam_reference}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="official_website">{t('auth.optWebsite')}</label>
                <input
                  type="url"
                  id="official_website"
                  name="official_website"
                  className="form-control"
                  placeholder="https://..."
                  value={formData.official_website}
                  onChange={handleChange}
                />
              </div>

              {/* Explicit Public Contact Consent Switch */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <input
                  type="checkbox"
                  id="show_contact_publicly"
                  name="show_contact_publicly"
                  checked={formData.show_contact_publicly}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="show_contact_publicly" style={{ fontSize: '0.82rem', color: '#c9d1d9', cursor: 'pointer' }}>
                  {t('auth.publicConsentLabel')}
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? t('common.loading') : t('nav.register')}
          </button>
        </form>

        <p className="auth-footer-text">
          {t('auth.alreadyAccount')} <Link to="/login">{t('nav.login')}</Link>
        </p>
      </div>
    </div>
  )
}
