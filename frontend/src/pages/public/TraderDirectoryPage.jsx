import React, { useState, useEffect } from 'react';
import { getPublicTraders } from '../../api/traderApi';
import { getRegisteredBuyers } from '../../api/buyerApi';

export const TraderDirectoryPage = () => {
  const [activeTab, setActiveTab] = useState('traders'); // 'traders' or 'buyers'

  // Data states
  const [traders, setTraders] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('West Bengal');
  const [districtFilter, setDistrictFilter] = useState('');
  const [mandiFilter, setMandiFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDirectoryData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'traders') {
        const data = await getPublicTraders({
          search,
          state: stateFilter,
          district: districtFilter,
          mandi: mandiFilter,
          commodity: commodityFilter,
          verification_status: statusFilter
        });
        setTraders(data.traders || []);
      } else {
        const data = await getRegisteredBuyers({
          search,
          state: stateFilter,
          district: districtFilter,
          mandi: mandiFilter,
          commodity: commodityFilter,
          verification_status: 'verified'
        });
        setBuyers(data.buyers || []);
      }
    } catch (err) {
      console.error('Fetch Directory Error:', err);
      setError(err.response?.data?.message || 'Failed to load directory records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectoryData();
  }, [activeTab, stateFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDirectoryData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStateFilter('');
    setDistrictFilter('');
    setMandiFilter('');
    setCommodityFilter('');
    setStatusFilter('');
    setTimeout(() => {
      fetchDirectoryData();
    }, 50);
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.25rem',
      color: 'var(--text-primary, #f0f6fc)'
    }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'rgba(22, 27, 34, 0.85)',
        border: '1px solid var(--border-gold, #d4af37)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🏛️</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>
            Verified Agricultural Businesses & Directory
          </h1>
        </div>
        <p style={{ color: '#8b949e', fontSize: '0.95rem', maxWidth: '850px', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
          Discover legitimate agricultural traders, wholesalers, rice millers, APMC market functionaries, and voluntary FarmOS-registered buyers. Every external business is tied strictly to official government, APEDA, WBSAMB, or business website source evidence.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.75rem'
      }}>
        <button
          onClick={() => setActiveTab('traders')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            border: activeTab === 'traders' ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'traders' ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'traders' ? '#fbbf24' : '#c9d1d9',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏬 Public Trader Directory ({activeTab === 'traders' ? traders.length : '...'})
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            border: activeTab === 'buyers' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: activeTab === 'buyers' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'buyers' ? '#60a5fa' : '#c9d1d9',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔵 FarmOS Registered Buyers ({activeTab === 'buyers' ? buyers.length : '...'})
        </button>
      </div>

      {/* Search & Filter Form */}
      <form onSubmit={handleSearchSubmit} style={{
        backgroundColor: 'rgba(22, 27, 34, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Search Business / Name</label>
            <input
              type="text"
              placeholder="e.g. Bardhaman Agro, Rice, Potato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f0f6fc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>State</label>
            <input
              type="text"
              placeholder="e.g. West Bengal"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f0f6fc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>District</label>
            <input
              type="text"
              placeholder="e.g. Hooghly, Bardhaman, Kolkata..."
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f0f6fc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Mandi / APMC</label>
            <input
              type="text"
              placeholder="e.g. Sheoraphuli APMC..."
              value={mandiFilter}
              onChange={(e) => setMandiFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f0f6fc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Commodity</label>
            <input
              type="text"
              placeholder="e.g. Potato, Rice, Wheat..."
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f0f6fc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {activeTab === 'traders' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.3rem' }}>Verification Level</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  color: '#f0f6fc',
                  fontSize: '0.88rem'
                }}
              >
                <option value="">All Verification Levels</option>
                <option value="source_verified">🟢 FarmOS Verified Business (Govt Evidence)</option>
                <option value="website_verified">🌐 Public Business Info (Official Website)</option>
                <option value="unverified">🏢 Public Business Listing</option>
                <option value="needs_review">⚠️ Needs Review</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#f59e0b',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔍 Search Directory
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#c9d1d9',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      </form>

      {/* Error / Loading */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#8b949e' }}>
          Loading directory records...
        </div>
      ) : activeTab === 'traders' ? (
        // PUBLIC TRADER DIRECTORY LIST
        traders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e' }}>
            No external business records found matching the specified filters.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem'
          }}>
            {traders.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'rgba(22, 27, 34, 0.8)',
                  border: t.verification_status === 'source_verified'
                    ? '1px solid rgba(34, 197, 94, 0.5)'
                    : t.verification_status === 'website_verified'
                      ? '1px solid rgba(59, 130, 246, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div>
                  {/* Card Header & Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f0f6fc', margin: 0, lineHeight: '1.3' }}>
                      {t.business_name}
                    </h3>
                  </div>

                  {/* Verification Badge */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    {t.verification_status === 'source_verified' && (
                      <span style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        color: '#4ade80',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        🟢 FarmOS Verified Business
                      </span>
                    )}

                    {t.verification_status === 'website_verified' && (
                      <span style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        color: '#60a5fa',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        🌐 Public Business Info
                      </span>
                    )}

                    {(t.verification_status === 'unverified' || t.verification_status === 'needs_review') && (
                      <span style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid #8b949e',
                        color: '#9ca3af',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        🏢 Public Listing ({t.verification_status})
                      </span>
                    )}

                    {t.official_website && (
                      <span style={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#c084fc',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        🌐 Website Verified
                      </span>
                    )}
                  </div>

                  {/* Business Meta Details */}
                  <div style={{ fontSize: '0.83rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Type:</strong> {t.business_type}
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Location:</strong> 📍 {t.city || t.district}, {t.state} {t.mandi ? `(Mandi: ${t.mandi})` : ''}
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Commodities:</strong> <span style={{ color: '#fbbf24', fontWeight: 600 }}>{t.commodities}</span>
                    </div>
                    {t.buying_capacity && (
                      <div>
                        <strong style={{ color: '#8b949e' }}>Buying Capacity:</strong> {t.buying_capacity}
                      </div>
                    )}
                  </div>

                  {/* Source Attribution & Proof */}
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.75rem',
                    color: '#8b949e',
                    marginBottom: '1rem',
                    borderLeft: '3px solid #f59e0b'
                  }}>
                    <div><strong>Evidence Source:</strong> {t.verification_source} ({t.source_type})</div>
                    <div><strong>Last Verified:</strong> {t.last_verified ? new Date(t.last_verified).toLocaleDateString() : 'Recent'}</div>
                    {t.source_url && (
                      <div style={{ marginTop: '0.2rem' }}>
                        <a
                          href={t.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#60a5fa', textDecoration: 'underline', wordBreak: 'break-all' }}
                        >
                          🔗 View Source Evidence
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verified Public Contact Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {t.official_website && (
                    <a
                      href={t.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        color: '#60a5fa',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      🌐 Official Website
                    </a>
                  )}

                  {t.official_contact_url && (
                    <a
                      href={t.official_contact_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#c084fc',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      ✉ Official Contact
                    </a>
                  )}

                  {t.public_phone && (
                    <a
                      href={`tel:${t.public_phone}`}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        color: '#4ade80',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      📞 Call {t.public_phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // REGISTERED FARMOS BUYERS LIST
        buyers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e' }}>
            No verified FarmOS registered buyers found matching the specified filters.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem'
          }}>
            {buyers.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'rgba(22, 27, 34, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f0f6fc', margin: 0 }}>
                      {b.business_name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#8b949e' }}>
                      Contact Person: <strong>{b.contact_person}</strong>
                    </span>
                  </div>

                  {/* Verification Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <span style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid #3b82f6',
                      color: '#60a5fa',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px'
                    }}>
                      🔵 FarmOS Registered Buyer
                    </span>

                    <span style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid #22c55e',
                      color: '#4ade80',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px'
                    }}>
                      🟢 Verified Account
                    </span>

                    {b.has_enam_ref && (
                      <span style={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#c084fc',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        🟣 e-NAM Reference Provided
                      </span>
                    )}

                    {b.has_udyam_ref && (
                      <span style={{
                        backgroundColor: 'rgba(234, 179, 8, 0.15)',
                        border: '1px solid #eab308',
                        color: '#facc15',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        📜 Udyam MSME Ref Provided
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ fontSize: '0.83rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Location:</strong> 📍 {b.district || b.location}, {b.state || ''} {b.mandi ? `(Mandi: ${b.mandi})` : ''}
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Commodities Purchased:</strong> <span style={{ color: '#fbbf24', fontWeight: 600 }}>{b.commodities || 'Various Agricultural Commodities'}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Buying Capacity:</strong> {b.buying_capacity}
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.75rem',
                    color: '#8b949e',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ color: '#4ade80' }}>✓ FarmOS Account & Phone Registered</div>
                    <div style={{ color: '#4ade80' }}>✓ Business profile reviewed by Admin</div>
                    <div style={{ color: '#8b949e' }}>
                      Consent to display contact: <strong>{b.show_contact_publicly ? 'Explicitly Granted' : 'Private'}</strong>
                    </div>
                  </div>
                </div>

                {/* Contact Actions (Only rendered if show_contact_publicly is true and phone exists) */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {b.show_contact_publicly && b.phone ? (
                    <>
                      <a
                        href={`tel:${b.phone}`}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid #22c55e',
                          color: '#4ade80',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        📞 Call {b.phone}
                      </a>
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid #10b981',
                          color: '#34d399',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        💬 WhatsApp
                      </a>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic' }}>
                      🔒 Contact information kept private per buyer request
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
