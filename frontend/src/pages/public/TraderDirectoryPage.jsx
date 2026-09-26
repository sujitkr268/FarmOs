import React, { useState, useEffect } from 'react';
import { getPublicTraders } from '../../api/traderApi';
import { getRegisteredBuyers } from '../../api/buyerApi';
import { useLanguage } from '../../context/LanguageContext';

export const TraderDirectoryPage = () => {
  const { t } = useLanguage();
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
      color: 'var(--text-heading, #0f172a)'
    }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🏛️</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2319', margin: 0 }}>
            {t('directory.title')}
          </h1>
        </div>
        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '850px', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
          {t('directory.subtitle')}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem'
      }}>
        <button
          onClick={() => setActiveTab('traders')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            border: activeTab === 'traders' ? '1px solid #0b2319' : '1px solid #e2e8f0',
            backgroundColor: activeTab === 'traders' ? '#0b2319' : '#ffffff',
            color: activeTab === 'traders' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏬 {t('directory.tabTraders')} ({activeTab === 'traders' ? traders.length : '...'})
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            border: activeTab === 'buyers' ? '1px solid #0b2319' : '1px solid #e2e8f0',
            backgroundColor: activeTab === 'buyers' ? '#0b2319' : '#ffffff',
            color: activeTab === 'buyers' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔵 {t('directory.tabBuyers')} ({activeTab === 'buyers' ? buyers.length : '...'})
        </button>
      </div>

      {/* Search & Filter Form */}
      <form onSubmit={handleSearchSubmit} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('directory.searchLabel')}</label>
            <input
              type="text"
              placeholder={t('directory.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#0f172a',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('common.state')}</label>
            <input
              type="text"
              placeholder="e.g. West Bengal"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#0f172a',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('common.district')}</label>
            <input
              type="text"
              placeholder="e.g. Hooghly, Bardhaman, Kolkata..."
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#0f172a',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('common.mandi')}</label>
            <input
              type="text"
              placeholder="e.g. Sheoraphuli APMC..."
              value={mandiFilter}
              onChange={(e) => setMandiFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#0f172a',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('common.commodity')}</label>
            <input
              type="text"
              placeholder="e.g. Potato, Rice, Wheat..."
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#0f172a',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {activeTab === 'traders' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.3rem' }}>{t('directory.verificationLevel')}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  color: '#0f172a',
                  fontSize: '0.88rem'
                }}
              >
                <option value="">{t('directory.allVerificationLevels')}</option>
                <option value="source_verified">{t('badges.sourceVerified')}</option>
                <option value="website_verified">{t('badges.websiteVerified')}</option>
                <option value="unverified">{t('badges.unverified')}</option>
                <option value="needs_review">{t('badges.needsReview')}</option>
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
            {t('directory.searchDirectoryBtn')}
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: '1px solid #cbd5e1',
              cursor: 'pointer'
            }}
          >
            {t('common.resetFilters')}
          </button>
        </div>
      </form>

      {/* Error / Loading */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          {t('common.loading')}
        </div>
      ) : activeTab === 'traders' ? (
        // PUBLIC TRADER DIRECTORY LIST
        traders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            {t('directory.noTradersFound')}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem'
          }}>
            {traders.map((tItem) => (
              <div
                key={tItem.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: tItem.verification_status === 'source_verified'
                    ? '1px solid #22c55e'
                    : tItem.verification_status === 'website_verified'
                      ? '1px solid #3b82f6'
                      : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div>
                  {/* Card Header & Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
                      {tItem.business_name}
                    </h3>
                  </div>

                  {/* Verification Badge */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    {tItem.verification_status === 'source_verified' && (
                      <span style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        color: '#166534',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.sourceVerified')}
                      </span>
                    )}

                    {tItem.verification_status === 'website_verified' && (
                      <span style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        color: '#1d4ed8',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.websiteVerified')}
                      </span>
                    )}

                    {(tItem.verification_status === 'unverified' || tItem.verification_status === 'needs_review') && (
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.unverified')}
                      </span>
                    )}

                    {tItem.official_website && (
                      <span style={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#7e22ce',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.websiteVerified')}
                      </span>
                    )}
                  </div>

                  {/* Business Meta Details */}
                  <div style={{ fontSize: '0.83rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.typeLabel')}</strong> {tItem.business_type}
                    </div>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.locationLabel')}</strong> 📍 {tItem.city || tItem.district}, {tItem.state} {tItem.mandi ? `(${t('common.mandi')}: ${tItem.mandi})` : ''}
                    </div>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.commoditiesLabel')}</strong> <span style={{ color: '#d97706', fontWeight: 600 }}>{tItem.commodities}</span>
                    </div>
                    {tItem.buying_capacity && (
                      <div>
                        <strong style={{ color: '#64748b' }}>{t('directory.buyingCapacity')}:</strong> {tItem.buying_capacity}
                      </div>
                    )}
                  </div>

                  {/* Source Attribution & Proof */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '1rem',
                    borderLeft: '3px solid #f59e0b'
                  }}>
                    <div><strong>{t('directory.evidenceSource')}:</strong> {tItem.verification_source} ({tItem.source_type})</div>
                    <div><strong>{t('directory.lastVerified')}:</strong> {tItem.last_verified ? new Date(tItem.last_verified).toLocaleDateString() : 'Recent'}</div>
                    {tItem.source_url && (
                      <div style={{ marginTop: '0.2rem' }}>
                        <a
                          href={tItem.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}
                        >
                          🔗 {t('directory.viewEvidence')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verified Public Contact Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  {tItem.official_website && (
                    <a
                      href={tItem.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        color: '#1d4ed8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      {t('directory.officialWebsite')}
                    </a>
                  )}

                  {tItem.official_contact_url && (
                    <a
                      href={tItem.official_contact_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#7e22ce',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      {t('directory.officialContact')}
                    </a>
                  )}

                  {tItem.public_phone && (
                    <a
                      href={`tel:${tItem.public_phone}`}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        color: '#166534',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      📞 {t('common.call')} {tItem.public_phone}
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
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            {t('directory.noBuyersFound')}
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #3b82f6',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {b.business_name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {t('directory.contactPerson')}: <strong>{b.contact_person}</strong>
                    </span>
                  </div>

                  {/* Verification Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <span style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid #3b82f6',
                      color: '#1d4ed8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px'
                    }}>
                      {t('badges.registeredBuyer')}
                    </span>

                    <span style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid #22c55e',
                      color: '#166534',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px'
                    }}>
                      {t('badges.verifiedAccount')}
                    </span>

                    {b.has_enam_ref && (
                      <span style={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid #a855f7',
                        color: '#7e22ce',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.enamRef')}
                      </span>
                    )}

                    {b.has_udyam_ref && (
                      <span style={{
                        backgroundColor: 'rgba(234, 179, 8, 0.15)',
                        border: '1px solid #eab308',
                        color: '#a16207',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {t('badges.udyamRef')}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ fontSize: '0.83rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.locationLabel')}</strong> 📍 {b.district || b.location}, {b.state || ''} {b.mandi ? `(${t('common.mandi')}: ${b.mandi})` : ''}
                    </div>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.commoditiesPurchased')}:</strong> <span style={{ color: '#d97706', fontWeight: 600 }}>{b.commodities || 'Various Agricultural Commodities'}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#64748b' }}>{t('directory.buyingCapacity')}:</strong> {b.buying_capacity}
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ color: '#166534', fontWeight: 600 }}>✓ FarmOS Account & Phone Registered</div>
                    <div style={{ color: '#166534', fontWeight: 600 }}>✓ Business profile reviewed by Admin</div>
                    <div style={{ color: '#64748b' }}>
                      Consent to display contact: <strong>{b.show_contact_publicly ? t('badges.explicitlyGranted') : t('badges.privateContact')}</strong>
                    </div>
                  </div>
                </div>

                {/* Contact Actions (Only rendered if show_contact_publicly is true and phone exists) */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  {b.show_contact_publicly && b.phone ? (
                    <>
                      <a
                        href={`tel:${b.phone}`}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid #22c55e',
                          color: '#166534',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        📞 {t('common.call')} {b.phone}
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
                          color: '#047857',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        💬 {t('common.whatsapp')}
                      </a>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic' }}>
                      🔒 {t('directory.contactPrivate')}
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
