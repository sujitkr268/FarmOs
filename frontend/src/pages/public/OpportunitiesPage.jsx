import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { compareMarketOpportunities } from '../../api/opportunityApi'
import { OpportunityCard } from '../../components/ui/OpportunityCard'
import { MarketComparison } from '../../components/MarketComparison'
import { PotentialBuyersCard } from '../../components/PotentialBuyersCard'
import { LoadingState } from '../../components/ui/LoadingState'

export const OpportunitiesPage = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()

  // Input States
  const [harvests, setHarvests] = useState([])
  const [selectedHarvestId, setSelectedHarvestId] = useState('')
  const [crop, setCrop] = useState(searchParams.get('crop') || 'Potato')
  const [quantity, setQuantity] = useState(searchParams.get('quantity') || '500')
  const [unit, setUnit] = useState(searchParams.get('unit') || 'kg')
  const [location, setLocation] = useState(searchParams.get('location') || user?.location || 'Kolkata')

  // API States
  const [loading, setLoading] = useState(false)
  const [oppResult, setOppResult] = useState(null)
  const [potentialBuyers, setPotentialBuyers] = useState([])
  const [error, setError] = useState('')

  // Fetch farmer's registered harvests if available
  const fetchHarvests = async () => {
    try {
      const res = await API.get('/harvests')
      const all = res.data?.harvests || []
      if (user?.id) {
        const farmerList = all.filter(h => String(h.farmer_id) === String(user.id))
        setHarvests(farmerList)
      } else {
        setHarvests(all)
      }
    } catch (err) {
      console.error('Fetch Harvests Error in OpportunitiesPage:', err)
    }
  }

  // Fetch potential buyers
  const fetchBuyers = async () => {
    try {
      const res = await API.get('/buyer-verification/buyers')
      setPotentialBuyers(res.data?.buyers || [])
    } catch (err) {
      console.error('Fetch Buyers Error in OpportunitiesPage:', err)
    }
  }

  // Run opportunity evaluation
  const runComparison = async (searchCrop, searchQty, searchUnit, searchLoc) => {
    setLoading(true)
    setError('')
    try {
      const res = await compareMarketOpportunities({
        crop: searchCrop,
        commodity: searchCrop,
        quantity: searchQty,
        unit: searchUnit,
        farmer_location: searchLoc,
        location: searchLoc
      })
      setOppResult(res)
    } catch (err) {
      console.error('Opportunity Calculation Error:', err)
      setError(err.response?.data?.message || 'Failed to fetch market opportunity calculation. Displaying baseline market prices.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHarvests()
    fetchBuyers()
    runComparison(crop, quantity, unit, location)
  }, [])

  // Handle harvest select change
  const handleHarvestSelect = (e) => {
    const id = e.target.value
    setSelectedHarvestId(id)
    if (!id) return

    const selected = harvests.find(h => String(h.id) === String(id))
    if (selected) {
      setCrop(selected.crop_name || 'Potato')
      setQuantity(selected.quantity ? String(selected.quantity) : '500')
      setUnit(selected.unit || 'kg')
      if (selected.location) setLocation(selected.location)

      runComparison(
        selected.crop_name || 'Potato',
        selected.quantity ? String(selected.quantity) : '500',
        selected.unit || 'kg',
        selected.location || location
      )
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    runComparison(crop, quantity, unit, location)
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem 1rem', color: '#10231b' }}>
      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '1.8rem' }}>🎯</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0b3d2e', margin: 0, letterSpacing: '-0.02em' }}>
            Market Opportunities & Comparison
          </h1>
        </div>
        <p style={{ color: '#647d70', fontSize: '0.92rem', margin: 0 }}>
          Evaluate mandi prices, road driving distance, freight logistics, and estimated net returns to find the best market for your harvest.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* 1. Input & Harvest Selection Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d6e4db',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(11, 35, 25, 0.04)'
      }}>
        {harvests.length > 0 && (
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e4eee7' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0b3d2e', marginBottom: '0.4rem' }}>
              📋 Select Your Registered Harvest:
            </label>
            <select
              value={selectedHarvestId}
              onChange={handleHarvestSelect}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                border: '1px solid #d6e4db',
                backgroundColor: '#f7faf8',
                fontSize: '0.92rem',
                color: '#10231b',
                fontWeight: 600
              }}
            >
              <option value="">-- Choose from your listed harvests --</option>
              {harvests.map(h => (
                <option key={h.id} value={h.id}>
                  🌾 {h.crop_name} ({h.quantity} {h.unit}) • ₹{h.price}/unit • 📍 {h.location}
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Commodity / Crop</label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Potato, Onion, Rice"
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="500"
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}>
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Farmer Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kolkata, Howrah, Burdwan"
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.68rem 1.25rem',
                backgroundColor: '#0b3d2e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(11, 61, 46, 0.2)'
              }}
            >
              {loading ? 'Evaluating...' : '🔍 Compare Markets'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Loading State */}
      {loading ? (
        <LoadingState message="Finding the best market opportunity..." />
      ) : (
        <div>
          {/* Opportunity Card Preview */}
          <OpportunityCard
            data={oppResult || {
              crop: crop,
              quantity: quantity,
              unit: unit,
              best_opportunity: {
                market: 'Birbhum APMC',
                price: 2400,
                distance: '198 km',
                travel_time: '2h 41m',
                freight: 3958,
                gross_revenue: 12000,
                net_return: 8042
              }
            }}
          />

          {/* Full Multi-Market Comparison Table & Logistics */}
          {oppResult && <MarketComparison data={oppResult} />}

          {/* Potential Buyers Section */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #d6e4db', borderRadius: '20px', padding: '1.5rem', marginTop: '1.75rem', boxShadow: '0 4px 20px rgba(11, 35, 25, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0b3d2e', margin: 0 }}>Matching Verified Buyers</h3>
                  <span style={{ fontSize: '0.8rem', color: '#647d70' }}>Connect with buyers looking for {crop}</span>
                </div>
              </div>
              <Link to="/traders" style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                View All Traders →
              </Link>
            </div>

            <PotentialBuyersCard buyers={potentialBuyers.length > 0 ? potentialBuyers : [
              { id: 1, business_name: 'AgriTrade Foods', verification_status: 'verified', badge_label: '🟢 FarmOS Verified Business', location: 'Kolkata, West Bengal', commodities: 'Potato, Onion', buying_capacity: '10,000 kg', show_contact_publicly: true, public_phone: '+91 98765 43210' },
              { id: 2, business_name: 'GreenHarvest Ltd', verification_status: 'website_verified', badge_label: '🌐 Public Business Info', location: 'Howrah, West Bengal', commodities: 'Potato, Vegetables', buying_capacity: '5,000 kg', show_contact_publicly: true, public_phone: '+91 98765 11223' },
              { id: 3, business_name: 'FreshMart Traders', verification_status: 'unverified', badge_label: '🏢 Public Listing', location: 'Kolkata, West Bengal', commodities: 'Potato, Tomato', buying_capacity: '3,000 kg', show_contact_publicly: false }
            ]} />
          </div>
        </div>
      )}
    </div>
  )
}

export default OpportunitiesPage
