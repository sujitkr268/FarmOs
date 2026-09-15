import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import TrustBadge from '../../components/TrustBadge'
import { getProfileApi, updateProfileApi } from '../../api/userApi'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    show_contact_publicly: false,
    // Buyer
    business_name: '',
    contact_person: '',
    state: '',
    district: '',
    mandi: '',
    commodities: '',
    buying_capacity: '',
    enam_reference: '',
    udyam_reference: '',
    official_website: '',
    // Farmer
    farm_size: '',
    crops_grown: '',
    village: '',
    farmer_reference: '',
    fpo_info: '',
    verification_evidence: ''
  })

  // Load latest profile from server
  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await getProfileApi()
      if (res && res.user) {
        updateUser(res.user)
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        show_contact_publicly: Boolean(user.show_contact_publicly),
        business_name: user.business_name || '',
        contact_person: user.contact_person || '',
        state: user.state || '',
        district: user.district || '',
        mandi: user.mandi || '',
        commodities: user.commodities || '',
        buying_capacity: user.buying_capacity || '',
        enam_reference: user.enam_reference || '',
        udyam_reference: user.udyam_reference || '',
        official_website: user.official_website || '',
        farm_size: user.farm_size || '',
        crops_grown: user.crops_grown || '',
        village: user.village || '',
        farmer_reference: user.farmer_reference || '',
        fpo_info: user.fpo_info || '',
        verification_evidence: user.verification_evidence || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleToggleConsent = async () => {
    try {
      const updatedConsent = !user?.show_contact_publicly
      const res = await updateProfileApi({ show_contact_publicly: updatedConsent })
      if (res && res.user) {
        updateUser(res.user)
        setMessage({ type: 'success', text: 'Public contact preference updated!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update contact preference.' })
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await updateProfileApi(formData)
      if (res && res.user) {
        updateUser(res.user)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setShowEditModal(false)
        setShowVerifyModal(false)
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (!user && loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}>
        Loading profile...
      </div>
    )
  }

  return (
    <div style={{ color: '#f3f4f6' }}>
      {/* Alert Messages */}
      {message.text && (
        <div style={{
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: '1px solid ' + (message.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'),
          color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
          padding: '1rem',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* User Header Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #0b2319 0%, #163e2e 100%)', height: '110px', position: 'relative' }}></div>
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '-3rem', marginBottom: '1rem', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '18px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '2.5rem',
                border: '4px solid #ffffff',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>{user?.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>{user?.role}</span>
                  <span style={{ color: '#94a3b8' }}>•</span>
                  <TrustBadge status={user?.verification_status} role={user?.role} size="sm" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowEditModal(true)}
                style={{ padding: '0.6rem 1.25rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ✏️ Edit Profile
              </button>
              {(user?.role === 'farmer' || user?.role === 'buyer') && user?.verification_status !== 'verified' && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  style={{ padding: '0.6rem 1.25rem', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 700, borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  🛡️ Submit Verification
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', pt: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Email Address</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{user?.email}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Phone Number</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{user?.phone || 'Not provided'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Location / State</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>📍 {user?.location || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Verification Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem' }} className="profile-split">
        {/* Left Column: Role Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Public Contact Consent Banner */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Public Contact Information</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Display phone number and email publicly on trade directory listings.
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={Boolean(user?.show_contact_publicly)}
                  onChange={handleToggleConsent}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  inset: 0,
                  backgroundColor: user?.show_contact_publicly ? '#10b981' : '#cbd5e1',
                  transition: '0.2s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '20px',
                    width: '20px',
                    left: user?.show_contact_publicly ? '24px' : '3px',
                    bottom: '3px',
                    backgroundColor: '#ffffff',
                    transition: '0.2s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
              State: {user?.show_contact_publicly ? '🟢 Publicly Visible' : '🔒 Hidden from directory search'}
            </div>
          </div>

          {/* Farmer Role Details */}
          {user?.role === 'farmer' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>🌾 Agriculture Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Farm Size</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.farm_size || 'Not specified'}</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Crops Grown</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{user?.crops_grown || 'Not specified'}</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Village / Panchayat</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.village || user?.location || 'Not specified'}</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>FPO / Cooperative</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.fpo_info || 'Independent Farmer'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buyer Role Details */}
          {user?.role === 'buyer' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>🏢 Business Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Firm Name</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.business_name || 'Not specified'}</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Primary Mandi</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{user?.mandi || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verification Status Card */}
        <div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>🛡️ Trust Verification</h3>
            <div style={{ marginBottom: '1rem' }}>
              <TrustBadge status={user?.verification_status} role={user?.role} size="lg" />
            </div>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Earn the FarmOS Verified badge to build instant trust with farmers and buyers.
            </p>
            {user?.verification_status !== 'verified' && (
              <button
                onClick={() => setShowVerifyModal(true)}
                style={{ width: '100%', padding: '0.65rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 800, borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Submit Verification Docs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>Edit Profile</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '0.55rem 1.1rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.55rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#111b15', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>🛡️ Verification Details</h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem' }}>Enter government credentials or references for admin review.</p>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Govt Reference ID</label>
                <input type="text" name={user?.role === 'farmer' ? 'farmer_reference' : 'enam_reference'} value={user?.role === 'farmer' ? formData.farmer_reference : formData.enam_reference} onChange={handleInputChange} style={{ width: '100%', backgroundColor: '#0c140e', border: '1px solid rgba(31, 56, 42, 0.8)', borderRadius: '8px', padding: '0.55rem', color: '#f3f4f6' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowVerifyModal(false)} style={{ padding: '0.55rem 1.1rem', backgroundColor: '#16261d', border: '1px solid rgba(31, 56, 42, 0.8)', color: '#9ca3af', borderRadius: '8px', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.55rem 1.25rem', backgroundColor: '#10b981', color: '#080e0a', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .profile-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export { ProfilePage }
export default ProfilePage
