import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { getPublicTraders, createPublicTrader, updatePublicTrader, deletePublicTrader } from '../../api/traderApi';
import { getPendingBuyers, verifyBuyer, rejectBuyer } from '../../api/buyerApi';
import { getPendingFarmersApi, verifyFarmerApi, rejectFarmerApi } from '../../api/adminApi';
import { VerificationBadge } from '../../components/VerificationBadge';
import { MetricCard } from '../../components/MetricCard';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers', 'farmers', 'traders', 'stats'

  // Data states
  const [stats, setStats] = useState(null);
  const [pendingBuyers, setPendingBuyers] = useState([]);
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [publicTraders, setPublicTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New Public Trader Form Modal
  const [showAddTraderModal, setShowAddTraderModal] = useState(false);
  const [editingTrader, setEditingTrader] = useState(null);
  const [traderForm, setTraderForm] = useState({
    business_name: '',
    business_type: 'Wholesaler',
    state: 'West Bengal',
    district: '',
    city: '',
    mandi: '',
    address: '',
    commodities: '',
    buying_capacity: '',
    official_website: '',
    official_contact_url: '',
    public_phone: '',
    public_email: '',
    registration_type: '',
    registration_reference: '',
    verification_source: '',
    source_url: '',
    source_type: 'Government Portal',
    verification_status: 'source_verified'
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'stats') {
        const res = await API.get('/admin/dashboard');
        setStats(res.data?.stats || null);
      } else if (activeTab === 'buyers') {
        const data = await getPendingBuyers();
        setPendingBuyers(data.buyers || []);
      } else if (activeTab === 'farmers') {
        const data = await getPendingFarmersApi();
        setPendingFarmers(data.farmers || []);
      } else if (activeTab === 'traders') {
        const data = await getPublicTraders({});
        setPublicTraders(data.traders || []);
      }
    } catch (err) {
      console.error('Admin Fetch Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleVerifyBuyer = async (id, name) => {
    try {
      const notes = prompt(`Enter verification note for ${name}:`, 'Verified by admin review of business details');
      if (notes === null) return;
      await verifyBuyer(id, notes);
      setSuccess(`Buyer "${name}" verified successfully!`);
      fetchData();
    } catch (err) {
      console.error('Verify Buyer Error:', err);
      setError(err.response?.data?.message || 'Failed to verify buyer.');
    }
  };

  const handleRejectBuyer = async (id, name) => {
    try {
      const notes = prompt(`Enter rejection reason for ${name}:`, 'Incomplete registration evidence');
      if (notes === null) return;
      await rejectBuyer(id, notes);
      setSuccess(`Buyer "${name}" rejected.`);
      fetchData();
    } catch (err) {
      console.error('Reject Buyer Error:', err);
      setError(err.response?.data?.message || 'Failed to reject buyer.');
    }
  };

  const handleVerifyFarmer = async (id, name) => {
    try {
      const notes = prompt(`Enter verification note for Farmer ${name}:`, 'Verified PM-KISAN/Land Record Evidence');
      if (notes === null) return;
      await verifyFarmerApi(id, notes);
      setSuccess(`Farmer "${name}" verified successfully!`);
      fetchData();
    } catch (err) {
      console.error('Verify Farmer Error:', err);
      setError(err.response?.data?.message || 'Failed to verify farmer.');
    }
  };

  const handleRejectFarmer = async (id, name) => {
    try {
      const notes = prompt(`Enter rejection note for Farmer ${name}:`, 'Incomplete evidence or invalid reference');
      if (notes === null) return;
      await rejectFarmerApi(id, notes);
      setSuccess(`Farmer "${name}" verification rejected.`);
      fetchData();
    } catch (err) {
      console.error('Reject Farmer Error:', err);
      setError(err.response?.data?.message || 'Failed to reject farmer.');
    }
  };

  const handleTraderSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingTrader) {
        await updatePublicTrader(editingTrader.id, traderForm);
        setSuccess(`Trader "${traderForm.business_name}" updated successfully.`);
      } else {
        await createPublicTrader(traderForm);
        setSuccess(`New public trader "${traderForm.business_name}" created.`);
      }
      setShowAddTraderModal(false);
      setEditingTrader(null);
      fetchData();
    } catch (err) {
      console.error('Save Trader Error:', err);
      setError(err.response?.data?.message || 'Failed to save trader record.');
    }
  };

  const openEditTrader = (trader) => {
    setEditingTrader(trader);
    setTraderForm({
      business_name: trader.business_name || '',
      business_type: trader.business_type || 'Wholesaler',
      state: trader.state || 'West Bengal',
      district: trader.district || '',
      city: trader.city || '',
      mandi: trader.mandi || '',
      address: trader.address || '',
      commodities: trader.commodities || '',
      buying_capacity: trader.buying_capacity || '',
      official_website: trader.official_website || '',
      official_contact_url: trader.official_contact_url || '',
      public_phone: trader.public_phone || '',
      public_email: trader.public_email || '',
      registration_type: trader.registration_type || '',
      registration_reference: trader.registration_reference || '',
      verification_source: trader.verification_source || '',
      source_url: trader.source_url || '',
      source_type: trader.source_type || 'Government Portal',
      verification_status: trader.verification_status || 'source_verified'
    });
    setShowAddTraderModal(true);
  };

  const handleDeleteTrader = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deletePublicTrader(id);
      setSuccess(`Record "${name}" deleted.`);
      fetchData();
    } catch (err) {
      console.error('Delete Trader Error:', err);
      setError(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  return (
    <div style={{ color: '#f3f4f6' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091a11 0%, #0f2d1e 50%, #07150d 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: 800, color: '#10b981', margin: 0, letterSpacing: '-0.02em' }}>
            🛡️ FarmOS Administration Portal
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: '0.3rem 0 0 0' }}>
            Review buyer/farmer applications & manage verified public trader directory records.
          </p>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          ✅ {success}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#0f2218',
        padding: '0.4rem',
        borderRadius: '14px',
        border: '1px solid rgba(31, 64, 46, 0.8)',
        marginBottom: '1.75rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <button
          onClick={() => setActiveTab('buyers')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'buyers' ? 700 : 500,
            color: activeTab === 'buyers' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'buyers' ? '#10b981' : 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          ⏳ Pending Buyers ({pendingBuyers.length})
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'farmers' ? 700 : 500,
            color: activeTab === 'farmers' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'farmers' ? '#10b981' : 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          🌾 Pending Farmers ({pendingFarmers.length})
        </button>

        <button
          onClick={() => setActiveTab('traders')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'traders' ? 700 : 500,
            color: activeTab === 'traders' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'traders' ? '#10b981' : 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          🏬 Trader Records ({publicTraders.length})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: activeTab === 'stats' ? 700 : 500,
            color: activeTab === 'stats' ? '#06120c' : '#9ca3af',
            backgroundColor: activeTab === 'stats' ? '#10b981' : 'transparent',
            whiteSpace: 'nowrap'
          }}
        >
          📊 System Analytics
        </button>
      </div>

      {loading ? (
        <LoadingState message="Fetching administration records..." />
      ) : activeTab === 'buyers' ? (
        pendingBuyers.length === 0 ? (
          <EmptyState icon="🎉" title="No Pending Buyers" description="All buyer account verification applications have been reviewed." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingBuyers.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: '#0f2218',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f3f4f6' }}>
                      {b.business_name}
                    </h3>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                      Pending Review
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div><strong>Applicant:</strong> {b.name} ({b.email} | {b.phone})</div>
                    <div><strong>Location:</strong> 📍 {b.district || b.location}, {b.state || ''}</div>
                    {b.enam_reference && <div style={{ color: '#a855f7' }}><strong>e-NAM Ref:</strong> {b.enam_reference}</div>}
                    {b.udyam_reference && <div style={{ color: '#f59e0b' }}><strong>Udyam Ref:</strong> {b.udyam_reference}</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button onClick={() => handleVerifyBuyer(b.id, b.business_name)} style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#06120c', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✅ Verify</button>
                  <button onClick={() => handleRejectBuyer(b.id, b.business_name)} style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.85rem' }}>❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'farmers' ? (
        pendingFarmers.length === 0 ? (
          <EmptyState icon="🌾" title="No Pending Farmers" description="All farmer verification requests have been processed." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingFarmers.map((f) => (
              <div
                key={f.id}
                style={{
                  backgroundColor: '#0f2218',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
                      {f.name}
                    </h3>
                    <VerificationBadge status={f.verification_status} role="farmer" size="sm" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <div>📍 Location: {f.village || f.location}</div>
                    <div>📞 Phone: {f.phone}</div>
                    <div>🌾 Crops: {f.crops_grown || 'N/A'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button onClick={() => handleVerifyFarmer(f.id, f.name)} style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#06120c', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✅ Verify</button>
                  <button onClick={() => handleRejectFarmer(f.id, f.name)} style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.85rem' }}>❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'traders' ? (
        <div style={{ backgroundColor: '#0f2218', border: '1px solid rgba(31, 64, 46, 0.8)', borderRadius: '18px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f3f4f6', fontWeight: 700 }}>Public Trader Directory Records ({publicTraders.length})</h3>
            <button
              onClick={() => {
                setEditingTrader(null);
                setTraderForm({
                  business_name: '',
                  business_type: 'Wholesaler',
                  state: 'West Bengal',
                  district: '',
                  city: '',
                  mandi: '',
                  address: '',
                  commodities: '',
                  buying_capacity: '',
                  official_website: '',
                  official_contact_url: '',
                  public_phone: '',
                  public_email: '',
                  registration_type: '',
                  registration_reference: '',
                  verification_source: '',
                  source_url: '',
                  source_type: 'Government Portal',
                  verification_status: 'source_verified'
                });
                setShowAddTraderModal(true);
              }}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#06120c', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ➕ Add Trader Record
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Business Name</th>
                  <th style={{ padding: '0.75rem' }}>Location</th>
                  <th style={{ padding: '0.75rem' }}>Commodities</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {publicTraders.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(31, 64, 46, 0.4)', color: '#f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                      {t.business_name}
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>{t.business_type}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>📍 {t.district}, {t.state}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 600 }}>{t.commodities}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                        {t.verification_status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditTrader(t)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: '#14291d', color: '#f3f4f6', border: '1px solid rgba(31, 64, 46, 0.8)', cursor: 'pointer', fontSize: '0.75rem' }}>✏️ Edit</button>
                        <button onClick={() => handleDeleteTrader(t.id, t.business_name)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <MetricCard title="Total Users" value={stats.total_users} icon="👥" color="emerald" />
            <MetricCard title="Farmers" value={stats.total_farmers} icon="🧑‍🌾" color="emerald" />
            <MetricCard title="Buyers" value={stats.total_buyers} icon="🏢" color="blue" />
            <MetricCard title="Harvests Listed" value={stats.total_harvests} icon="🌾" color="amber" />
          </div>
        )
      )}

      {/* Add/Edit Modal */}
      {showAddTraderModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="farm-modal-content" style={{ backgroundColor: '#0f2218', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', maxWidth: '560px', width: '100%', padding: '1.25rem' }}>
            <h3 style={{ marginTop: 0, color: '#10b981', fontSize: '1.05rem', fontWeight: 700 }}>
              {editingTrader ? `✏️ Edit Record: ${editingTrader.business_name}` : '➕ Add Verified Public Trader Record'}
            </h3>

            <form onSubmit={handleTraderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Business Name *</label>
                <input type="text" required value={traderForm.business_name} onChange={(e) => setTraderForm({ ...traderForm, business_name: e.target.value })} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#f3f4f6', padding: '0.5rem', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>State *</label>
                  <input type="text" required value={traderForm.state} onChange={(e) => setTraderForm({ ...traderForm, state: e.target.value })} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#f3f4f6', padding: '0.5rem', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>District *</label>
                  <input type="text" required value={traderForm.district} onChange={(e) => setTraderForm({ ...traderForm, district: e.target.value })} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#f3f4f6', padding: '0.5rem', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>Commodities *</label>
                <input type="text" required placeholder="Potato, Rice, Paddy" value={traderForm.commodities} onChange={(e) => setTraderForm({ ...traderForm, commodities: e.target.value })} style={{ width: '100%', backgroundColor: '#06120c', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#f3f4f6', padding: '0.5rem', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddTraderModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#14291d', border: '1px solid rgba(31, 64, 46, 0.8)', color: '#9ca3af', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.15rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#06120c', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
