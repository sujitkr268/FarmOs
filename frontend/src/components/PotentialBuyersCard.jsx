import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PotentialBuyersCard = ({ buyers = [] }) => {
  const { t } = useLanguage();
  if (!buyers || buyers.length === 0) {
    return (
      <div style={{
        backgroundColor: 'rgba(22, 27, 34, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginTop: '1rem',
        color: '#8b949e',
        fontSize: '0.85rem'
      }}>
        ℹ️ {t('opportunity.noPotentialBuyers')} <a href="/traders" style={{ color: '#fbbf24' }}>{t('opportunity.checkDirectory')}</a>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'rgba(22, 27, 34, 0.85)',
      border: '1px solid rgba(59, 130, 246, 0.4)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      marginTop: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      color: '#f0f6fc'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🤝</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa', margin: 0 }}>
            {t('opportunity.potentialBuyersTitle')} ({buyers.length})
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
          {t('opportunity.potentialBuyersSubtitle')}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {buyers.map((b, idx) => {
          const badgeLabel = b?.badge_label || (
            b?.verification_status === 'source_verified' || b?.verification_status === 'verified'
              ? '🟢 FarmOS Verified Business'
              : b?.verification_status === 'website_verified'
                ? '🌐 Public Business Info'
                : '🏢 Public Listing'
          );

          const isVerified = typeof badgeLabel === 'string' && badgeLabel.includes('🟢');
          const isWebsiteVerified = typeof badgeLabel === 'string' && badgeLabel.includes('🌐');
          const phoneNum = b?.public_phone || b?.phone;

          return (
            <div
              key={b?.id || idx}
              style={{
                backgroundColor: 'rgba(13, 17, 23, 0.7)',
                border: b?.verification_status === 'source_verified' || b?.verification_status === 'verified'
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.98rem', color: '#f0f6fc' }}>{b?.business_name || 'Verified Buyer'}</strong>
                </div>

                {/* Badge */}
                <div style={{ marginBottom: '0.6rem' }}>
                  <span style={{
                    backgroundColor: isVerified
                      ? 'rgba(34, 197, 94, 0.15)'
                      : isWebsiteVerified
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(168, 85, 247, 0.15)',
                    color: isVerified ? '#4ade80' : isWebsiteVerified ? '#60a5fa' : '#c084fc',
                    border: '1px solid currentColor',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '10px'
                  }}>
                    {badgeLabel}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <div>📍 <strong>Location:</strong> {b?.location || 'Location Not Specified'}</div>
                  <div>📦 <strong>Capacity:</strong> {b?.buying_capacity || 'N/A'}</div>
                  <div>🌾 <strong>Commodities:</strong> <span style={{ color: '#fbbf24' }}>{b?.commodities || 'Various Crops'}</span></div>
                </div>

                {/* Explainable Match Criteria */}
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.72rem',
                  color: '#4ade80',
                  display: 'flex',
                  gap: '0.6rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.75rem'
                }}>
                  <span>✓ {t('buyer.cropMatch') || 'Crop matches'}</span>
                  <span>✓ {t('buyer.qtyMatch') || 'Quantity matches'}</span>
                  <span>✓ {t('buyer.locationMatch') || 'Location suitable'}</span>
                </div>
              </div>

              {/* Contact Actions */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {b?.official_website && (
                  <a
                    href={b.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid #3b82f6',
                      color: '#60a5fa',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    🌐 Website
                  </a>
                )}

                {phoneNum && (
                  <a
                    href={`tel:${phoneNum}`}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid #22c55e',
                      color: '#4ade80',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    📞 Call
                  </a>
                )}

                {b?.source_url && (
                  <a
                    href={b.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#c9d1d9',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    🔗 Source
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
