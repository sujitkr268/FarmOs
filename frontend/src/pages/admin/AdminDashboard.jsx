import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { getPublicTraders, createPublicTrader, updatePublicTrader, deletePublicTrader } from '../../api/traderApi';
import { getPendingBuyers, verifyBuyer, rejectBuyer } from '../../api/buyerApi';
import { getPendingFarmersApi, verifyFarmerApi, rejectFarmerApi } from '../../api/adminApi';
import TrustBadge from '../../components/TrustBadge';
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

  // Handle Verify Buyer
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

  // Handle Reject Buyer
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

  // Handle Verify Farmer
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

  // Handle Reject Farmer
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

  // Handle Submit Trader Form (Add or Edit)
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

  // Open Edit Trader Modal
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

  // Handle Delete Trader
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
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.25rem',
      color: '#f0f6fc'
    }}>
      {/* Admin Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>
            {t('admin.title')}
          </h1>
          <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            {t('admin.subtitle')}
          </p>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          {success}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('buyers')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: activeTab === 'buyers' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'buyers' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            color: activeTab === 'buyers' ? '#60a5fa' : '#c9d1d9',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {t('admin.tabPendingBuyers')} ({pendingBuyers.length})
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: activeTab === 'farmers' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'farmers' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: activeTab === 'farmers' ? '#34d399' : '#c9d1d9',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          🌾 Pending Farmers ({pendingFarmers.length})
        </button>

        <button
          onClick={() => setActiveTab('traders')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: activeTab === 'traders' ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'traders' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
            color: activeTab === 'traders' ? '#fbbf24' : '#c9d1d9',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {t('admin.tabTraderManagement')} ({publicTraders.length})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: activeTab === 'stats' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'stats' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            color: activeTab === 'stats' ? '#c084fc' : '#c9d1d9',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {t('admin.tabSystemStats')}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e' }}>
          Loading admin records...
        </div>
      ) : activeTab === 'buyers' ? (
        // PENDING BUYER APPLICATIONS TAB
        pendingBuyers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e' }}>
            🎉 No pending buyer registration applications right now! All buyer accounts reviewed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingBuyers.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'rgba(22, 27, 34, 0.8)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: '12px',
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
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f0f6fc' }}>
                      {b.business_name}
                    </h3>
                    <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid #eab308', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                      Pending Review
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div><strong>Applicant:</strong> {b.name} ({b.email} | {b.phone})</div>
                    <div><strong>Location:</strong> 📍 {b.district || b.location}, {b.state || ''} {b.mandi ? `(Mandi: ${b.mandi})` : ''}</div>
                    <div><strong>Commodities & Capacity:</strong> {b.commodities || 'N/A'} ({b.buying_capacity})</div>
                    {b.enam_reference && <div style={{ color: '#c084fc' }}><strong>e-NAM Reference:</strong> {b.enam_reference}</div>}
                    {b.udyam_reference && <div style={{ color: '#facc15' }}><strong>Udyam Reference:</strong> {b.udyam_reference}</div>}
                    {b.official_website && <div style={{ color: '#60a5fa' }}><strong>Website:</strong> {b.official_website}</div>}
                    <div><strong>Public Contact Consent:</strong> {b.show_contact_publicly ? 'Explicitly Granted' : 'Private'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleVerifyBuyer(b.id, b.business_name)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: '#22c55e',
                      color: '#000000',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Verify Buyer
                  </button>

                  <button
                    onClick={() => handleRejectBuyer(b.id, b.business_name)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      fontWeight: 700,
                      border: '1px solid #ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'farmers' ? (
        // PENDING FARMER VERIFICATION APPLICATIONS TAB
        pendingFarmers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e' }}>
            🎉 No pending farmer verification applications right now! All farmer submissions reviewed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {pendingFarmers.map((f) => (
              <div
                key={f.id}
                style={{
                  backgroundColor: 'rgba(22, 27, 34, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0f6fc', margin: 0 }}>
                      {f.name}
                    </h3>
                    <TrustBadge status={f.verification_status} role="farmer" size="sm" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.85rem', color: '#c9d1d9', marginTop: '0.75rem' }}>
                    <div>📍 <strong>Location:</strong> {f.village || f.location}</div>
                    <div>📞 <strong>Phone:</strong> {f.phone}</div>
                    <div>🌾 <strong>Crops:</strong> {f.crops_grown || 'Not specified'}</div>
                    <div>📏 <strong>Farm Size:</strong> {f.farm_size || 'Not specified'}</div>
                    <div>🏛️ <strong>FPO Info:</strong> {f.fpo_info || 'Independent'}</div>
                    <div>🆔 <strong>PM-KISAN / KCC Ref:</strong> <span style={{ fontFamily: 'monospace', color: '#34d399' }}>{f.farmer_reference || 'None'}</span></div>
                  </div>

                  {f.verification_evidence && (
                    <div style={{ marginTop: '0.75rem', padding: '0.6rem', backgroundColor: 'rgba(13, 17, 23, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '0.8rem', color: '#8b949e' }}>
                      📝 <strong>Evidence Submitted:</strong> {f.verification_evidence}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleVerifyFarmer(f.id, f.name)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: '#22c55e',
                      color: '#000000',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Verify Farmer
                  </button>
                  <button
                    onClick={() => handleRejectFarmer(f.id, f.name)}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      fontWeight: 700,
                      border: '1px solid #ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'traders' ? (
        // PUBLIC TRADER DIRECTORY MANAGEMENT TAB
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f0f6fc' }}>Public Trader Directory Records ({publicTraders.length})</h3>
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
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ➕ Add Verified Public Record
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Business Name</th>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Location</th>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Commodities</th>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Source & Verification</th>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Status</th>
                  <th style={{ padding: '0.75rem', color: '#8b949e' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {publicTraders.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#f0f6fc' }}>
                      {t.business_name}
                      <div style={{ fontSize: '0.75rem', color: '#8b949e', fontWeight: 400 }}>{t.business_type}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#c9d1d9' }}>
                      📍 {t.district}, {t.state}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                      {t.commodities}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8b949e', fontSize: '0.78rem' }}>
                      <div>{t.verification_source}</div>
                      {t.source_url && (
                        <a href={t.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                          Source Link
                        </a>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        backgroundColor: t.verification_status === 'source_verified' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: t.verification_status === 'source_verified' ? '#4ade80' : '#60a5fa',
                        border: '1px solid currentColor',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '8px'
                      }}>
                        {t.verification_status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditTrader(t)}
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#f0f6fc', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTrader(t.id, t.business_name)}
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // STATS OVERVIEW TAB
        stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(22, 27, 34, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem' }}>
              <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Total Users</span>
              <h2 style={{ fontSize: '1.8rem', margin: '0.3rem 0 0 0', color: '#f0f6fc' }}>{stats.total_users}</h2>
            </div>

            <div style={{ backgroundColor: 'rgba(22, 27, 34, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem' }}>
              <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Total Farmers</span>
              <h2 style={{ fontSize: '1.8rem', margin: '0.3rem 0 0 0', color: '#34d399' }}>{stats.total_farmers}</h2>
            </div>

            <div style={{ backgroundColor: 'rgba(22, 27, 34, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem' }}>
              <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Total Buyers</span>
              <h2 style={{ fontSize: '1.8rem', margin: '0.3rem 0 0 0', color: '#60a5fa' }}>{stats.total_buyers}</h2>
            </div>

            <div style={{ backgroundColor: 'rgba(22, 27, 34, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem' }}>
              <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Total Harvests Listed</span>
              <h2 style={{ fontSize: '1.8rem', margin: '0.3rem 0 0 0', color: '#fbbf24' }}>{stats.total_harvests}</h2>
            </div>
          </div>
        )
      )}

      {/* Add / Edit Public Trader Modal */}
      {showAddTraderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#161b22',
            border: '1px solid #d4af37',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0, color: '#f59e0b' }}>
              {editingTrader ? `✏️ Edit Public Record: ${editingTrader.business_name}` : '➕ Add Verified Public Trader Record'}
            </h3>

            <form onSubmit={handleTraderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Business Name *</label>
                <input
                  type="text"
                  required
                  value={traderForm.business_name}
                  onChange={(e) => setTraderForm({ ...traderForm, business_name: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>State *</label>
                  <input
                    type="text"
                    required
                    value={traderForm.state}
                    onChange={(e) => setTraderForm({ ...traderForm, state: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>District *</label>
                  <input
                    type="text"
                    required
                    value={traderForm.district}
                    onChange={(e) => setTraderForm({ ...traderForm, district: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Commodities Handled *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Potato, Rice, Paddy"
                  value={traderForm.commodities}
                  onChange={(e) => setTraderForm({ ...traderForm, commodities: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Verification Source *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APEDA AgriExchange Directory"
                    value={traderForm.verification_source}
                    onChange={(e) => setTraderForm({ ...traderForm, verification_source: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Exact Source URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={traderForm.source_url}
                    onChange={(e) => setTraderForm({ ...traderForm, source_url: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Verification Status</label>
                  <select
                    value={traderForm.verification_status}
                    onChange={(e) => setTraderForm({ ...traderForm, verification_status: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  >
                    <option value="source_verified">source_verified (Govt Evidence)</option>
                    <option value="website_verified">website_verified (Official Website)</option>
                    <option value="unverified">unverified (Public Listing)</option>
                    <option value="needs_review">needs_review</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Official Website (Optional)</label>
                  <input
                    type="url"
                    placeholder="http://..."
                    value={traderForm.official_website}
                    onChange={(e) => setTraderForm({ ...traderForm, official_website: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', backgroundColor: '#f59e0b', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTraderModal(false)}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
