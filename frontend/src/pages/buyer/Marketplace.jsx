import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import './marketplace.css'

export const Marketplace = () => {
  const { user, isAuthenticated } = useAuth()

  // Data states
  const [harvests, setHarvests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState('newest') // newest, price_low, price_high
  const [maxPrice, setMaxPrice] = useState('')

  // Order Modal state
  const [selectedHarvest, setSelectedHarvest] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState('')
  const [orderError, setOrderError] = useState('')

  // Fetch available harvests from backend
  const fetchMarketplaceHarvests = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await API.get('/harvests')
      const allHarvests = response.data?.harvests || []
      
      // Requirement 3: Only display harvests where status === "available"
      const availableHarvests = allHarvests.filter(
        (h) => h.status === 'available'
      )
      setHarvests(availableHarvests)
    } catch (err) {
      console.error('Fetch Marketplace Error:', err)
      setError(err.response?.data?.message || 'Failed to load marketplace harvests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketplaceHarvests()
  }, [])

  // Open Order Modal
  const openOrderModal = (harvest) => {
    setError('')
    setSuccess('')
    setOrderError('')
    setSelectedHarvest(harvest)
    setOrderQuantity('1') // default 1 unit
  }

  // Handle Order Submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setOrderError('')

    if (!isAuthenticated) {
      setOrderError('Please log in as a buyer to place an order.')
      return
    }

    if (user?.role !== 'buyer') {
      setOrderError('Only registered buyers can place orders. Farmers cannot order harvest produce.')
      return
    }

    const qtyNum = Number(orderQuantity)
    const availableQty = Number(selectedHarvest.quantity)

    // Requirement 7 Validation: Quantity > 0 and <= stock
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setOrderError('Order quantity must be greater than zero.')
      return
    }

    if (qtyNum > availableQty) {
      setOrderError(`Requested quantity (${qtyNum}) exceeds available stock (${availableQty} ${selectedHarvest.unit}).`)
      return
    }

    setSubmitting(true)

    try {
      await API.post('/orders', {
        harvest_id: selectedHarvest.id,
        quantity: qtyNum
      })

      setSuccess(`🎉 Order placed successfully for ${qtyNum} ${selectedHarvest.unit} of ${selectedHarvest.crop_name}!`)
      setSelectedHarvest(null)
      setOrderQuantity('')

      // Requirement 9: Refresh marketplace data after successful order
      fetchMarketplaceHarvests()
    } catch (err) {
      console.error('Place Order Error:', err)
      const serverMessage = err.response?.data?.message || 'Failed to place order. Please try again.'
      setOrderError(serverMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Filter & Search Logic
  const filteredHarvests = harvests
    .filter((h) => {
      // Search crop name or location
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        h.crop_name.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query)

      // Filter max price
      const matchesPrice = !maxPrice || Number(h.price) <= Number(maxPrice)

      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      if (selectedSort === 'price_low') {
        return Number(a.price) - Number(b.price)
      }
      if (selectedSort === 'price_high') {
        return Number(b.price) - Number(a.price)
      }
      // default: newest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })

  // Estimated order cost calculation
  const calculatedTotal =
    selectedHarvest && orderQuantity && !isNaN(Number(orderQuantity)) && Number(orderQuantity) > 0
      ? Number(orderQuantity) * Number(selectedHarvest.price)
      : 0

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <h1 className="marketplace-title">🏪 Agriculture Marketplace</h1>
        <p className="marketplace-subtitle">
          Browse fresh, verified farm produce directly from farmers across the region.
        </p>
      </div>

      {/* Global Alerts */}
      {error && <div className="alert-message alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
      {success && <div className="alert-message alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-group">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by crop name (e.g. Rice, Wheat) or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="form-control"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_low">Sort: Price (Low to High)</option>
            <option value="price_high">Sort: Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Marketplace Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Loading marketplace harvests...
        </div>
      ) : filteredHarvests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌾</div>
          <h3>No Produce Found</h3>
          <p>
            {searchQuery || maxPrice
              ? 'No harvests match your search criteria. Try clearing filters.'
              : 'No available harvests listed in the marketplace right now.'}
          </p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {filteredHarvests.map((harvest) => (
            <div key={harvest.id} className="marketplace-card">
              <div>
                <div className="card-top">
                  <h3 className="card-crop-name">{harvest.crop_name}</h3>
                  <span className="status-badge status-available">
                    {harvest.status}
                  </span>
                </div>

                <div className="card-location">
                  📍 {harvest.location}
                </div>

                <div className="card-price-tag">
                  <div>
                    <span className="price-val">₹{Number(harvest.price).toLocaleString()}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> / {harvest.unit}</span>
                  </div>
                  <span className="stock-val">
                    {Number(harvest.quantity).toLocaleString()} {harvest.unit} available
                  </span>
                </div>

                {/* Farmer Info - Displayed only if present in API response */}
                {harvest.farmer_name && (
                  <div className="farmer-badge">
                    <div className="farmer-name">🧑‍🌾 Farmer: {harvest.farmer_name}</div>
                    {harvest.farmer_phone && (
                      <div className="farmer-contact">📞 {harvest.farmer_phone}</div>
                    )}
                  </div>
                )}

                {harvest.description && (
                  <p className="harvest-desc">{harvest.description}</p>
                )}
              </div>

              <button
                onClick={() => openOrderModal(harvest)}
                className="order-btn"
              >
                🛒 Place Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Order Placement Modal */}
      {selectedHarvest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">🛒 Order {selectedHarvest.crop_name}</h3>

            {orderError && <div className="alert-message alert-error" style={{ marginBottom: '1rem' }}>{orderError}</div>}

            <form onSubmit={handlePlaceOrder} className="auth-form">
              <div className="form-group">
                <label>Available Stock</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${Number(selectedHarvest.quantity).toLocaleString()} ${selectedHarvest.unit}`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Price per Unit</label>
                <input
                  type="text"
                  className="form-control"
                  value={`₹ ${Number(selectedHarvest.price).toLocaleString()} per ${selectedHarvest.unit}`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="orderQuantity">Order Quantity ({selectedHarvest.unit}) *</label>
                <input
                  type="number"
                  id="orderQuantity"
                  className="form-control"
                  step="0.01"
                  min="0.01"
                  max={selectedHarvest.quantity}
                  placeholder={`Enter quantity (max ${selectedHarvest.quantity})`}
                  value={orderQuantity}
                  onChange={(e) => {
                    setOrderQuantity(e.target.value)
                    setOrderError('')
                  }}
                  required
                />
              </div>

              {/* Dynamic Cost Calculation Summary */}
              <div className="calc-summary-box">
                <div className="calc-row">
                  <span>Unit Price:</span>
                  <span>₹{Number(selectedHarvest.price).toLocaleString()}</span>
                </div>
                <div className="calc-row">
                  <span>Quantity:</span>
                  <span>{orderQuantity || 0} {selectedHarvest.unit}</span>
                </div>
                <div className="calc-row calc-total">
                  <span>Estimated Total Cost:</span>
                  <span>₹{calculatedTotal.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  className="auth-btn"
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Submitting Order...' : 'Confirm & Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHarvest(null)}
                  className="btn-edit"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
