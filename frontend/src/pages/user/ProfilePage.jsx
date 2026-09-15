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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('profile.title', 'User Profile')}</h1>
        <p className="text-gray-600 mt-1">{t('profile.subtitle', 'Manage your account, role details, and trust verification status.')}</p>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-lg leading-none">&times;</button>
        </div>
      )}

      {/* User Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 h-28 relative"></div>
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border border-gray-100 flex items-center justify-center text-emerald-800 font-bold text-4xl uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="capitalize font-semibold text-gray-600 text-sm">{user?.role}</span>
                  <span className="text-gray-400">•</span>
                  <TrustBadge status={user?.verification_status} role={user?.role} size="sm" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
              >
                ✏️ Edit Profile
              </button>
              {(user?.role === 'farmer' || user?.role === 'buyer') && user?.verification_status !== 'verified' && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
                >
                  🛡️ Submit Verification
                </button>
              )}
            </div>
          </div>

          {/* Key Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm">
            <div>
              <span className="text-gray-500 block text-xs">Email</span>
              <span className="font-medium text-gray-800">{user?.email}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Phone</span>
              <span className="font-medium text-gray-800">{user?.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Location</span>
              <span className="font-medium text-gray-800">{user?.location || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Role Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Public Contact Consent Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Public Contact Information</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Control whether your phone number and email are displayed on the public market and buyer directory.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={Boolean(user?.show_contact_publicly)}
                  onChange={handleToggleConsent}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <div className="mt-3 text-xs text-gray-500 font-medium">
              Current state: {user?.show_contact_publicly ? '🟢 Visible to Public' : '🔒 Hidden (Only verified deals will connect)'}
            </div>
          </div>

          {/* Farmer Role Profile Card */}
          {user?.role === 'farmer' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🌾 Farmer Profile & Agriculture Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Farm Size</span>
                  <span className="font-semibold text-gray-800">{user?.farm_size || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Crops Grown</span>
                  <span className="font-semibold text-gray-800">{user?.crops_grown || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Village / Panchayat</span>
                  <span className="font-semibold text-gray-800">{user?.village || user?.location || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">FPO / Cooperative Info</span>
                  <span className="font-semibold text-gray-800">{user?.fpo_info || 'Independent Farmer'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl md:col-span-2">
                  <span className="text-xs text-gray-500 block">Govt Farmer Ref / KCC / PM-KISAN ID</span>
                  <span className="font-semibold text-gray-800 font-mono">{user?.farmer_reference || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buyer Role Profile Card */}
          {user?.role === 'buyer' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🏢 Business & Buyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Business / Firm Name</span>
                  <span className="font-semibold text-gray-800">{user?.business_name || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Contact Person</span>
                  <span className="font-semibold text-gray-800">{user?.contact_person || user?.name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">State & District</span>
                  <span className="font-semibold text-gray-800">{user?.state ? `${user.state}, ${user.district || ''}` : user?.location}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Primary Mandi</span>
                  <span className="font-semibold text-gray-800">{user?.mandi || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Commodities Dealt</span>
                  <span className="font-semibold text-gray-800">{user?.commodities || 'All agricultural produce'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Buying Capacity</span>
                  <span className="font-semibold text-gray-800">{user?.buying_capacity || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">e-NAM Trader Ref</span>
                  <span className="font-semibold text-gray-800 font-mono">{user?.enam_reference || 'None'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Udyam Registration Ref</span>
                  <span className="font-semibold text-gray-800 font-mono">{user?.udyam_reference || 'None'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1 col): Verification Status Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              🛡️ Verification Status
            </h3>
            
            <div className="mb-4">
              <TrustBadge status={user?.verification_status} role={user?.role} size="lg" />
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {user?.verification_status === 'verified' ? (
                'Your account is fully verified by FarmOS Admin. Verified badge builds trust with farmers and buyers.'
              ) : user?.verification_status === 'pending' ? (
                'Your verification application is currently under review by the FarmOS admin team.'
              ) : (
                'Submit your government ID or official registration references to earn the FarmOS Verified badge.'
              )}
            </p>

            {user?.verification_notes && (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200 mb-4">
                <strong>Admin Note:</strong> {user.verification_notes}
              </div>
            )}

            {user?.verification_status !== 'verified' && (
              <button
                onClick={() => setShowVerifyModal(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
              >
                Update Verification Documents
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Modal: Edit Profile */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location / State</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
              </div>

              {user?.role === 'farmer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Size (e.g. 5 Acres)</label>
                      <input
                        type="text"
                        name="farm_size"
                        value={formData.farm_size}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Village / Panchayat</label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Crops Grown</label>
                    <input
                      type="text"
                      name="crops_grown"
                      value={formData.crops_grown}
                      onChange={handleInputChange}
                      placeholder="e.g. Rice, Wheat, Mustard"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">FPO / Cooperative Info</label>
                    <input
                      type="text"
                      name="fpo_info"
                      value={formData.fpo_info}
                      onChange={handleInputChange}
                      placeholder="e.g. Krishi Farmer Producer Co."
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </>
              )}

              {user?.role === 'buyer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mandi</label>
                      <input
                        type="text"
                        name="mandi"
                        value={formData.mandi}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Verification */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                🛡️ Submit Verification Evidence ({user?.role === 'farmer' ? 'Farmer Verification' : 'Buyer Verification'})
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
              <p className="text-xs text-gray-600">
                Providing government or official credentials speeds up verification by FarmOS Admins.
              </p>

              {user?.role === 'farmer' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      PM-KISAN ID / Kisaan Credit Card / Govt Farmer Reference
                    </label>
                    <input
                      type="text"
                      name="farmer_reference"
                      value={formData.farmer_reference}
                      onChange={handleInputChange}
                      placeholder="e.g. PMK-987654321"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Verification Evidence & Additional Notes
                    </label>
                    <textarea
                      name="verification_evidence"
                      rows="3"
                      value={formData.verification_evidence}
                      onChange={handleInputChange}
                      placeholder="Provide land record registration details, FPO registration number, or verification links."
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">e-NAM Trader Reference ID</label>
                    <input
                      type="text"
                      name="enam_reference"
                      value={formData.enam_reference}
                      onChange={handleInputChange}
                      placeholder="e.g. ENAM-TR-102938"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Udyam Registration Number</label>
                    <input
                      type="text"
                      name="udyam_reference"
                      value={formData.udyam_reference}
                      onChange={handleInputChange}
                      placeholder="e.g. UDYAM-KR-00-1234567"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Official Website</label>
                    <input
                      type="url"
                      name="official_website"
                      value={formData.official_website}
                      onChange={handleInputChange}
                      placeholder="https://www.agribusiness.com"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  {saving ? 'Submitting...' : 'Submit Verification Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export { ProfilePage }
export default ProfilePage
