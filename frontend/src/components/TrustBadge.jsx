import React from 'react'

/**
 * TrustBadge component to standardise verification status presentation across FarmOS.
 * Accepts `status`, `role`, `type`, `sourceVerified`, or `size` ('sm', 'md', 'lg').
 */
const TrustBadge = ({ status, role = 'farmer', sourceVerified = null, size = 'md' }) => {
  let badgeText = ''
  let badgeColor = ''
  let badgeIcon = ''

  const isVerified = status === 'verified' || status === 'government_verified' || status === 'official_registry_verified' || sourceVerified === 'FarmOS Verified Business'

  if (role === 'farmer') {
    if (isVerified) {
      badgeText = 'FarmOS Verified Farmer'
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300'
      badgeIcon = '🟢'
    } else if (status === 'pending') {
      badgeText = 'Verification Pending'
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300'
      badgeIcon = '⏳'
    } else {
      badgeText = 'Unverified Farmer'
      badgeColor = 'bg-slate-100 text-slate-700 border-slate-300'
      badgeIcon = '⚪'
    }
  } else if (role === 'buyer') {
    if (isVerified) {
      badgeText = 'FarmOS Verified Buyer'
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300'
      badgeIcon = '🟢'
    } else if (status === 'pending') {
      badgeText = 'FarmOS Registered Buyer (Pending Audit)'
      badgeColor = 'bg-sky-100 text-sky-800 border-sky-300'
      badgeIcon = '🔵'
    } else {
      badgeText = 'FarmOS Registered Buyer'
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300'
      badgeIcon = '🔵'
    }
  } else if (role === 'trader' || role === 'public_trader') {
    if (isVerified) {
      badgeText = 'FarmOS Verified Business'
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300'
      badgeIcon = '🟢'
    } else {
      badgeText = 'Public Listing'
      badgeColor = 'bg-slate-100 text-slate-700 border-slate-300'
      badgeIcon = '📋'
    }
  } else {
    // Admin or generic
    badgeText = 'FarmOS Verified Admin'
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-300'
    badgeIcon = '🛡️'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-sm px-2.5 py-1 font-semibold',
    lg: 'text-base px-3 py-1.5 font-bold'
  }[size] || 'text-sm px-2.5 py-1 font-semibold'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${badgeColor} ${sizeClasses}`}>
      <span>{badgeIcon}</span>
      <span>{badgeText}</span>
    </span>
  )
}

export default TrustBadge
