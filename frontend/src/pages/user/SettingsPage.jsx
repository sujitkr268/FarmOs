import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { updateProfileApi } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const [savingConsent, setSavingConsent] = useState(false)
  const [consentMsg, setConsentMsg] = useState('')

  const handleToggleConsent = async () => {
    setSavingConsent(true)
    setConsentMsg('')
    try {
      const updatedConsent = !user?.show_contact_publicly
      const res = await updateProfileApi({ show_contact_publicly: updatedConsent })
      if (res && res.user) {
        updateUser(res.user)
        setConsentMsg(t('common.success'))
      }
    } catch (err) {
      setConsentMsg(t('common.error'))
    } finally {
      setSavingConsent(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-600 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="space-y-6">
        
        {/* Language Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">🌐 {t('settings.language')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('settings.subtitle')}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                language === 'en'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div>
                <span className="block text-base">English</span>
                <span className="text-xs font-normal text-gray-500">English Language</span>
              </div>
              {language === 'en' && <span className="text-emerald-600 font-bold">✓</span>}
            </button>

            <button
              onClick={() => setLanguage('hi')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                language === 'hi'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div>
                <span className="block text-base">हिन्दी</span>
                <span className="text-xs font-normal text-gray-500">Hindi Language</span>
              </div>
              {language === 'hi' && <span className="text-emerald-600 font-bold">✓</span>}
            </button>
          </div>
        </div>

        {/* Privacy & Contact Consent Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">🔒 {t('settings.privacy')}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t('settings.privacySub')}
          </p>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <span className="font-semibold text-gray-900 text-sm block">{t('settings.showContactLabel')}</span>
              <span className="text-xs text-gray-500">
                {user?.show_contact_publicly ? t('settings.enabledContact') : t('settings.disabledContact')}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={Boolean(user?.show_contact_publicly)}
                onChange={handleToggleConsent}
                disabled={savingConsent}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          {consentMsg && <p className="text-xs text-emerald-700 font-medium mt-2">{consentMsg}</p>}
        </div>

        {/* Account Details & Logout Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t('settings.accountOverview')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">{t('settings.loggedInAs')}</span>
              <span className="font-semibold text-gray-900">{user?.name}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">{t('settings.role')}</span>
              <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
            >
              {t('settings.signOut')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export { SettingsPage }
export default SettingsPage
