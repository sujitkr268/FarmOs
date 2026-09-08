import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import './farmer.css'

export const FarmerDashboard = () => {
  const { user } = useAuth()

  // State management
  const [harvests, setHarvests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states for Add Harvest
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    description: ''
  })

  // Edit Modal State
  const [editingHarvest, setEditingHarvest] = useState(null)
  const [editFormData, setEditFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    description: '',
    status: 'available'
  })

  // Fetch harvests for logged-in farmer
  const fetchHarvests = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await API.get('/harvests')
      const allHarvests = response.data?.harvests || []
      
      // Filter harvests belonging exclusively to the current farmer
      const farmerHarvests = allHarvests.filter(
        (h) => String(h.farmer_id) === String(user?.id)
      )
      setHarvests(farmerHarvests)
    } catch (err) {
      console.error('Fetch Harvests Error:', err)
      setError(err.response?.data?.message || 'Failed to load your harvests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchHarvests()
    }
  }, [user])

  // Handle Add Form Input Changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  // Submit New Harvest
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await API.post('/harvests', {
        crop_name: formData.crop_name,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        price: Number(formData.price),
        location: formData.location,
        description: formData.description
      })

      setSuccess('🌾 New harvest posted successfully!')
      setFormData({
        crop_name: '',
        quantity: '',
        unit: 'kg',
        price: '',
        location: '',
        description: ''
      })

      // Refresh list
      fetchHarvests()
    } catch (err) {
      console.error('Create Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to create harvest listing.')
    } finally {
      setSubmitting(false)
    }
  }

  // Open Edit Modal
  const openEditModal = (harvest) => {
    setEditingHarvest(harvest)
    setEditFormData({
      crop_name: harvest.crop_name || '',
      quantity: harvest.quantity || '',
      unit: harvest.unit || 'kg',
      price: harvest.price || '',
      location: harvest.location || '',
      description: harvest.description || '',
      status: harvest.status || 'available'
    })
    setError('')
    setSuccess('')
  }

  // Handle Edit Input Changes
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    })
  }

  // Submit Edit Harvest
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await API.put(`/harvests/${editingHarvest.id}`, {
        crop_name: editFormData.crop_name,
        quantity: Number(editFormData.quantity),
        unit: editFormData.unit,
        price: Number(editFormData.price),
        location: editFormData.location,
        description: editFormData.description,
        status: editFormData.status
      })

      setSuccess(`Harvest "${editFormData.crop_name}" updated successfully!`)
      setEditingHarvest(null)
      fetchHarvests()
    } catch (err) {
      console.error('Update Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to update harvest.')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Harvest
  const handleDelete = async (id, cropName) => {
    if (!window.confirm(`Are you sure you want to delete "${cropName}"?`)) {
      return
    }

    setError('')
    setSuccess('')
    try {
      await API.delete(`/harvests/${id}`)
      setSuccess(`Harvest "${cropName}" deleted.`)
      fetchHarvests()
    } catch (err) {
      console.error('Delete Harvest Error:', err)
      setError(err.response?.data?.message || 'Failed to delete harvest.')
    }
  }

  // Derived Overview Statistics
  const totalListings = harvests.length
  const activeListings = harvests.filter((h) => h.status === 'available').length
  const totalQuantity = harvests.reduce((acc, h) => acc + Number(h.quantity || 0), 0)

  return (
    <div className="farmer-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🧑‍🌾 Farmer Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, <strong>{user?.name}</strong> ({user?.location || 'Location Not Specified'})
          </p>
        </div>
      </div>

      {/* Global Alerts */}
      {error && <div className="alert-message alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
      {success && <div className="alert-message alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-info">
            <h4>Total Listings</h4>
            <div className="stat-value">{totalListings}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h4>Active Harvests</h4>
            <div className="stat-value" style={{ color: 'var(--accent-green-bright)' }}>{activeListings}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h4>Total Quantity Listed</h4>
            <div className="stat-value">{totalQuantity.toLocaleString()} Units</div>
          </div>
        </div>
      </div>

      {/* Add Harvest Form */}
      <div className="form-card">
        <h2 className="form-title">➕ Post New Harvest</h2>
        <form onSubmit={handleAddSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="crop_name">Crop Name *</label>
              <input
                type="text"
                id="crop_name"
                name="crop_name"
                className="form-control"
                placeholder="e.g. Organic Wheat, Basmati Rice"
                value={formData.crop_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-control"
                placeholder="e.g. 500"
                step="0.01"
                min="0.1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit *</label>
              <select
                id="unit"
                name="unit"
                className="form-control"
                value={formData.unit}
                onChange={handleInputChange}
                required
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="quintal">quintal (100 kg)</option>
                <option value="ton">ton (1000 kg)</option>
                <option value="crate">crate</option>
                <option value="bag">bag</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price per Unit (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                placeholder="e.g. 35"
                step="0.01"
                min="0.1"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Farm Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                placeholder="e.g. Bardhaman, West Bengal"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group form-grid-full">
              <label htmlFor="description">Harvest Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                placeholder="Specify quality, moisture content, variety details, or transport terms..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={submitting} style={{ marginTop: '1.25rem', width: '220px' }}>
            {submitting ? 'Posting...' : 'Post Harvest Listing'}
          </button>
        </form>
      </div>

      {/* My Harvests Section */}
      <div className="harvests-section-title">
        <span>📋 My Harvest Listings ({harvests.length})</span>
        <button onClick={fetchHarvests} className="btn-edit" style={{ flex: 'initial', padding: '0.4rem 1rem' }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading your harvests...
        </div>
      ) : harvests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌾</div>
          <h3>No Harvest Listings Found</h3>
          <p>You haven't posted any harvest listings yet. Fill out the form above to add your first harvest!</p>
        </div>
      ) : (
        <div className="harvests-grid">
          {harvests.map((harvest) => (
            <div key={harvest.id} className="harvest-card">
              <div>
                <div className="harvest-header">
                  <h3 className="crop-name">{harvest.crop_name}</h3>
                  <span className={`status-badge ${harvest.status === 'available' ? 'status-available' : 'status-unavailable'}`}>
                    {harvest.status}
                  </span>
                </div>

                <div className="harvest-details">
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <strong>{Number(harvest.quantity).toLocaleString()} {harvest.unit}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Price:</span>
                    <span className="detail-price">₹{Number(harvest.price).toLocaleString()} / {harvest.unit}</span>
                  </div>
                  <div className="detail-row">
                    <span>Location:</span>
                    <span>📍 {harvest.location}</span>
                  </div>
                </div>

                {harvest.description && (
                  <p className="harvest-desc">{harvest.description}</p>
                )}
              </div>

              <div className="harvest-actions">
                <button onClick={() => openEditModal(harvest)} className="btn-edit">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(harvest.id, harvest.crop_name)} className="btn-delete">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Harvest Modal */}
      {editingHarvest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">✏️ Edit Harvest: {editingHarvest.crop_name}</h3>
            <form onSubmit={handleEditSubmit} className="auth-form">
              <div className="form-group">
                <label>Crop Name</label>
                <input
                  type="text"
                  name="crop_name"
                  className="form-control"
                  value={editFormData.crop_name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    step="0.01"
                    value={editFormData.quantity}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    name="unit"
                    className="form-control"
                    value={editFormData.unit}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="crate">crate</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Price per Unit (₹)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    step="0.01"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="auth-btn" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHarvest(null)}
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
