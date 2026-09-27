import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export const OpportunityCard = ({ data, onViewClick }) => {
  const { t } = useLanguage()
  const [showExplanation, setShowExplanation] = React.useState(false)

  if (!data) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.75rem' }}>
        <div style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>
          {t('opportunity.noCalculated')}
        </div>
      </div>
    )
  }

  const bestMarket = data.recommended || data.best_opportunity || (data.opportunities && data.opportunities[0]) || {
    market: 'Hooghly Mandi',
    modal_price: 1850,
    estimated_gross_value: 37000,
    estimated_freight_cost: null,
    estimated_net_return: 37000,
    estimated_distance: null,
    travel_time_mins: null,
    grade: 'FAQ Grade'
  }

  const cropName = data.crop || data.commodity || 'Potato'
  const cropQty = data.quantity || '2,000'
  const cropUnit = data.unit || 'kg'
  const cropGrade = bestMarket.grade || 'FAQ Grade'

  // Gross Value
  const grossVal = Number(bestMarket.estimated_gross_value || bestMarket.gross_revenue || bestMarket.gross_value || 0)

  // Freight / Transport Cost Evaluation
  const rawFreightCandidate = bestMarket.estimated_freight_cost ??
                              bestMarket.freight_cost ??
                              bestMarket.freight ??
                              (bestMarket.estimated_transport_cost !== 'Not available' ? bestMarket.estimated_transport_cost : null)

  const parsedFreight = (rawFreightCandidate !== null && rawFreightCandidate !== undefined && rawFreightCandidate !== '')
    ? Number(rawFreightCandidate)
    : NaN

  const hasFreightCost = !isNaN(parsedFreight) && parsedFreight > 0
  const freightCost = hasFreightCost ? parsedFreight : 0
  const isEstimatedFreight = bestMarket.is_estimated_freight ?? (hasFreightCost ? true : false)
  const freightRate = bestMarket.base_rate_per_km || 30
  const vehicleName = bestMarket.vehicle_name || 'Standard Truck'
  const vehiclesRequired = bestMarket.vehicles_required || 1

  // Net Return Evaluation
  const backendNetReturn = Number(bestMarket.estimated_net_return ?? bestMarket.net_return ?? bestMarket.estimated_net_value ?? NaN)

  let netReturn
  if (hasFreightCost && grossVal > 0) {
    if (!isNaN(backendNetReturn) && backendNetReturn === grossVal - freightCost) {
      netReturn = backendNetReturn
    } else {
      netReturn = grossVal - freightCost
    }
  } else if (grossVal > 0) {
    netReturn = grossVal
  } else {
    netReturn = !isNaN(backendNetReturn) ? backendNetReturn : 0
  }

  // Distance Evaluation
  const distanceCandidate = bestMarket.distance_km ?? bestMarket.estimated_distance ?? bestMarket.distance
  const parsedDistance = typeof distanceCandidate === 'number'
    ? distanceCandidate
    : parseFloat(distanceCandidate)

  const hasValidDistance = !isNaN(parsedDistance) && parsedDistance > 0
  const isEstimatedDistance = bestMarket.is_estimated_distance ?? (bestMarket.distance_type === 'estimated' || (hasValidDistance && !bestMarket.distance_km))

  const distanceText = hasValidDistance
    ? (isEstimatedDistance
        ? `📍 ${t('opportunity.estimatedDistance', 'Estimated distance')}: ${parsedDistance} km`
        : `📍 ${parsedDistance} km away`)
    : `📍 ${t('opportunity.distanceUnavailable', 'Distance unavailable')}`

  // Travel Time Evaluation
  const travelMinsCandidate = bestMarket.travel_time_mins ?? bestMarket.travel_time
  const parsedTravelMins = typeof travelMinsCandidate === 'number'
    ? travelMinsCandidate
    : parseFloat(travelMinsCandidate)

  const hasValidTravelTime = !isNaN(parsedTravelMins) && parsedTravelMins > 0
  const travelTimeText = hasValidTravelTime
    ? `⏱️ ~${Math.round((parsedTravelMins / 60) * 10) / 10} hours`
    : null

  const distanceInfo = travelTimeText
    ? `${distanceText} • ${travelTimeText}`
    : distanceText

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '2px solid #10b981',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '1.75rem',
      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>⭐</span>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {t('opportunity.yourOpportunity')}
            </h2>
            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
              🌾 <strong>{cropName}</strong> • 📦 {cropQty} {cropUnit} • 🏷 <strong>{cropGrade}</strong>
            </span>
          </div>
        </div>

        <span style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 800,
          padding: '0.3rem 0.75rem',
          borderRadius: '20px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {t('opportunity.recommendedMarket')}
        </span>
      </div>

      {/* Target Market Strip */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>SELL AT:</span>
          <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>🏛️ {bestMarket.market || 'Hooghly Mandi'}</strong>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
          {distanceInfo}
        </div>
      </div>

      {/* FINANCIAL SUMMARY BOX */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
          FINANCIAL SUMMARY
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>{t('opportunity.estGrossValue')}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>
              ₹{grossVal.toLocaleString()}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, display: 'block' }}>
              {hasFreightCost ? (isEstimatedFreight ? t('opportunity.estimatedFreight', 'Estimated Freight Transport Cost') : t('opportunity.freightCostLabel', 'Freight Transport Cost')) : t('opportunity.freightCostLabel', 'Freight Transport Cost')}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: hasFreightCost ? '#dc2626' : '#64748b' }}>
              {hasFreightCost ? `−₹${freightCost.toLocaleString()}` : t('opportunity.dataUnavailable', 'Data unavailable')}
            </span>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>{t('opportunity.estNetReturn')}</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
              ₹{netReturn.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ESTIMATED FREIGHT NOTICE & EXPANDABLE EXPLANATION */}
      {hasFreightCost && (
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.65rem 0.9rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span>ℹ️ {t('opportunity.estimatedNotice', 'Freight is estimated from distance. Actual transport cost may vary.')}</span>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              {t('opportunity.howIsThisEstimated', 'How is this estimated?')} {showExplanation ? '▲' : '▼'}
            </button>
          </div>

          {showExplanation && (
            <div style={{ borderTop: '1px solid #cbd5e1', marginTop: '0.65rem', paddingTop: '0.65rem', fontSize: '0.8rem', color: '#334155' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', color: '#0f172a' }}>
                {t('opportunity.howIsThisEstimated', 'How is this estimated?')}
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Distance:</span>
                  <strong>{parsedDistance} km</strong> ({isEstimatedDistance ? 'Geographical estimate' : 'Actual road route'})
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>{t('opportunity.transportRate', 'Transport rate')}:</span>
                  <strong>₹{freightRate}/km</strong> ({vehicleName})
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Estimated freight:</span>
                  <strong>₹{freightCost.toLocaleString()}</strong> ({parsedDistance} km × ₹{freightRate}/km × {vehiclesRequired} vehicle)
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>{t('opportunity.estNetReturn', 'Estimated Net Return')}:</span>
                  <strong>₹{grossVal.toLocaleString()} − ₹{freightCost.toLocaleString()} = ₹{netReturn.toLocaleString()}</strong>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
                "{t('opportunity.actualTransportVaries', 'Actual transport charges may vary depending on vehicle type, load, fuel prices and local transport rates.')}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* WHY FARMOS RECOMMENDS THIS */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
          {t('opportunity.whyThisOpp')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.4rem', fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
          {((data?.reasons || bestMarket?.reasons || []).length > 0) ? (
            (data?.reasons || bestMarket?.reasons).map((reason, rIdx) => (
              <div key={rIdx}>✓ {reason}</div>
            ))
          ) : (
            <>
              <div>✓ Reported Agmarknet price benchmark</div>
              <div>✓ Road freight distance evaluated</div>
              <div>✓ Quality grade compatible</div>
              <div>✓ Earning net return maximized</div>
            </>
          )}
        </div>
      </div>

      {onViewClick && (
        <button
          onClick={onViewClick}
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.92rem',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Contact Verified Buyer / Continue →
        </button>
      )}
    </div>
  )
}

export default OpportunityCard
